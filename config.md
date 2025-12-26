# Configuracao AWS SES para Recebimento de Emails

## Visao Geral

Este documento descreve como configurar a AWS para receber emails nos dominios do tempemails.

**Dominio padrao**: `porranenhuma.com`

**Todos os dominios suportados**:
- porranenhuma.com (padrao)
- biscoito.email
- bolacha.email
- tuamaeaquelaursa.email
- aquelaursa.email
- xablau.email
- suamaeaquelaursa.com

> **Importante**: SES Inbound so funciona em algumas regioes: `us-east-1`, `us-west-2`, `eu-west-1`

---

## Arquitetura

```
Email enviado para usuario@porranenhuma.com
                    |
                    v
              DNS MX Record
                    |
                    v
            AWS SES Inbound
                    |
                    v
              Receipt Rule
                    |
          +---------+---------+
          |                   |
          v                   v
         S3              Lambda (opcional)
          |                   |
          +--------+----------+
                   |
                   v
          Aplicacao Next.js
```

---

## 1. Verificar Dominio no SES

### Via AWS Console:
1. Acesse **SES > Verified identities**
2. Clique em **Create identity**
3. Selecione **Domain**
4. Digite: `porranenhuma.com`
5. Clique em **Create identity**

### Via CLI:
```bash
aws ses verify-domain-identity --domain porranenhuma.com --region us-east-1
```

### Registros DNS necessarios:

Adicione os registros retornados pelo SES:

```dns
; TXT para verificacao do dominio (valor retornado pelo SES)
_amazonses.porranenhuma.com    TXT    "verificacao-retornada-pelo-ses"

; DKIM (3 registros CNAME retornados pelo SES)
xxxx._domainkey.porranenhuma.com    CNAME    xxxx.dkim.amazonses.com
yyyy._domainkey.porranenhuma.com    CNAME    yyyy.dkim.amazonses.com
zzzz._domainkey.porranenhuma.com    CNAME    zzzz.dkim.amazonses.com
```

---

## 2. Configurar DNS - MX Records

Para receber emails, adicione o registro MX apontando para o SES:

```dns
; MX Record - aponta emails para SES (regiao us-east-1)
porranenhuma.com.    MX    10    inbound-smtp.us-east-1.amazonaws.com.

; SPF (opcional, para envio)
porranenhuma.com.    TXT    "v=spf1 include:amazonses.com ~all"
```

**Regioes disponiveis para MX:**
- `inbound-smtp.us-east-1.amazonaws.com` (N. Virginia)
- `inbound-smtp.us-west-2.amazonaws.com` (Oregon)
- `inbound-smtp.eu-west-1.amazonaws.com` (Ireland)

---

## 3. Criar Bucket S3

### Via Console:
1. Acesse **S3 > Create bucket**
2. Nome: `tempemails-inbox`
3. Regiao: `us-east-1`
4. Criar bucket

### Via CLI:
```bash
aws s3 mb s3://tempemails-inbox --region us-east-1
```

### Adicionar Policy ao Bucket:

Va em **Bucket > Permissions > Bucket Policy** e adicione:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSESPuts",
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::tempemails-inbox/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceAccount": "SEU_ACCOUNT_ID"
        }
      }
    }
  ]
}
```

> Substitua `SEU_ACCOUNT_ID` pelo ID da sua conta AWS (ex: `123456789012`)

---

## 4. Criar Receipt Rule Set no SES

### Via Console:

1. Acesse **SES > Email receiving > Rule sets**
2. Clique em **Create rule set**
3. Nome: `tempemails-rules`
4. Clique em **Create rule set**
5. Selecione o rule set e clique em **Set as active**

### Criar Regra:

1. Dentro do rule set, clique em **Create rule**
2. Nome: `save-to-s3`
3. Recipients:
   - `porranenhuma.com`
   - `biscoito.email`
   - `bolacha.email`
   - `tuamaeaquelaursa.email`
   - `aquelaursa.email`
   - `xablau.email`
   - `suamaeaquelaursa.com`
4. Actions:
   - **Add action > Deliver to S3 bucket**
   - Bucket: `tempemails-inbox`
   - Object key prefix: `emails/`
5. Salvar regra

### Via CLI:

```bash
# Criar rule set
aws ses create-receipt-rule-set \
  --rule-set-name tempemails-rules \
  --region us-east-1

# Ativar o rule set
aws ses set-active-receipt-rule-set \
  --rule-set-name tempemails-rules \
  --region us-east-1

# Criar regra
aws ses create-receipt-rule \
  --rule-set-name tempemails-rules \
  --region us-east-1 \
  --rule '{
    "Name": "save-to-s3",
    "Enabled": true,
    "Recipients": [
      "porranenhuma.com",
      "biscoito.email",
      "bolacha.email",
      "tuamaeaquelaursa.email",
      "aquelaursa.email",
      "xablau.email",
      "suamaeaquelaursa.com"
    ],
    "Actions": [
      {
        "S3Action": {
          "BucketName": "tempemails-inbox",
          "ObjectKeyPrefix": "emails/"
        }
      }
    ]
  }'
```

---

## 5. Lambda para Processar Emails

A Lambda processa emails recebidos pelo SES e salva diretamente no S3 da aplicacao.

> **Codigo completo**: Veja o arquivo `lambda.js` na raiz do projeto.
> **Instrucoes de deploy**: Veja `lambda.README.md` para o passo a passo.

### Fluxo:
```
Email -> SES -> S3 (raw) -> Lambda -> S3 (JSON estruturado) -> App Next.js
```

### O que a Lambda faz:
1. Recebe evento do SES quando email chega
2. Le email raw do bucket `tempemails-inbox`
3. Faz parse do formato MIME com `mailparser`
4. Verifica se a caixa existe e esta em modo `identified`
5. Salva mensagem estruturada no bucket `tempemails`

### Adicionar Lambda ao Receipt Rule:

Atualize a regra para acionar a Lambda:

```bash
aws ses update-receipt-rule \
  --rule-set-name tempemails-rules \
  --region us-east-1 \
  --rule '{
    "Name": "save-to-s3",
    "Enabled": true,
    "Recipients": ["porranenhuma.com"],
    "Actions": [
      {
        "S3Action": {
          "BucketName": "tempemails-inbox",
          "ObjectKeyPrefix": "emails/"
        }
      },
      {
        "LambdaAction": {
          "FunctionArn": "arn:aws:lambda:us-east-1:SEU_ACCOUNT_ID:function:process-email",
          "InvocationType": "Event"
        }
      }
    ]
  }'
```

---

## 6. Variaveis de Ambiente

Adicione ao `.env` da aplicacao:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 Buckets
AWS_S3_BUCKET=tempemails
AWS_SES_INBOX_BUCKET=tempemails-inbox

# Webhook (para Lambda)
WEBHOOK_SECRET=seu-secret-seguro-aqui

# Dominios
ALLOWED_DOMAINS=porranenhuma.com,biscoito.email,bolacha.email,tuamaeaquelaursa.email,aquelaursa.email,xablau.email,suamaeaquelaursa.com
DEFAULT_DOMAIN=porranenhuma.com
```

---

## 7. Estrutura de Emails no S3

Emails sao salvos no S3 em formato raw (MIME):

```
s3://tempemails-inbox/
└── emails/
    ├── abc123xyz...    <- messageId do SES
    ├── def456uvw...
    └── ...
```

Conteudo de cada arquivo (email raw):

```
Return-Path: <sender@example.com>
Received: from mail.example.com ...
From: Sender Name <sender@example.com>
To: usuario@porranenhuma.com
Subject: Confirme seu cadastro
Date: Fri, 6 Dec 2024 10:00:00 -0300
Content-Type: text/plain; charset=UTF-8

Corpo do email aqui...
```

---

## 8. Custos Estimados

| Servico | Custo | Observacao |
|---------|-------|------------|
| SES Inbound | $0.10 / 1000 emails | Primeiros 1000/mes gratis |
| S3 Storage | $0.023 / GB / mes | Emails sao pequenos |
| S3 Requests | $0.0004 / 1000 PUT | Negligivel |
| Lambda | $0.20 / 1M requests | Primeiros 1M/mes gratis |

**Estimativa para 10.000 emails/mes: ~$1-2 USD**

---

## 9. Checklist de Configuracao

- [ ] Verificar dominio `porranenhuma.com` no SES
- [ ] Adicionar registros DNS (TXT, DKIM, MX)
- [ ] Criar bucket S3 `tempemails-inbox`
- [ ] Adicionar policy ao bucket
- [ ] Criar Receipt Rule Set
- [ ] Criar Receipt Rule com todos os dominios
- [ ] Ativar Rule Set
- [ ] (Opcional) Criar Lambda para processar emails
- [ ] Testar enviando email para `teste@porranenhuma.com`
- [ ] Verificar se email aparece no S3

---

## 10. Troubleshooting

### Email nao chega no S3:
1. Verifique se o MX record esta correto: `dig MX porranenhuma.com`
2. Verifique se o Rule Set esta ativo
3. Verifique se o dominio esta na lista de Recipients da regra
4. Verifique os logs do SES em CloudWatch

### Erro de permissao no S3:
1. Verifique a bucket policy
2. Confirme que o `AWS:SourceAccount` esta correto

### Lambda nao e acionada:
1. Verifique se a Lambda tem permissao para ser invocada pelo SES
2. Adicione a permissao:
```bash
aws lambda add-permission \
  --function-name process-email \
  --statement-id ses-invoke \
  --action lambda:InvokeFunction \
  --principal ses.amazonaws.com \
  --source-account SEU_ACCOUNT_ID
```

---

## Contato

Em caso de duvidas sobre a configuracao, consulte a documentacao oficial:
- [AWS SES Email Receiving](https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html)
- [SES Receipt Rules](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-concepts.html)
