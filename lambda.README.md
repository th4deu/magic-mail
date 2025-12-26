# Lambda: Processador de Emails SES

Esta Lambda processa emails recebidos pelo AWS SES e os organiza em estrutura de pastas por domínio e conta.

## Fluxo

```
Email externo → SES Inbound → S3 (raw) → Lambda → S3 (estruturado) → App Next.js
```

## Estrutura de Buckets

A Lambda usa **dois buckets**:

```
tempemails-inbox/                    ← Bucket de entrada (SES salva aqui)
└── emails/
    └── {messageId}                  ← Email raw MIME

tempemails/                          ← Bucket da aplicação (Lambda salva aqui)
└── {domain}/{slug}/messages/
    └── {messageId}.json             ← Email parseado JSON
```

**Exemplo de fluxo:**
```
Entrada: s3://tempemails-inbox/emails/abc123xyz
Saída:   s3://tempemails/xablau.email/meunome/messages/abc123xyz.json
```

## Deploy na AWS

### 1. Preparar o pacote

Como a Lambda usa `mailparser`, precisa criar um pacote zip:

```bash
# Criar pasta temporária
mkdir lambda-deploy && cd lambda-deploy

# Copiar código
cp ../lambda.js index.js

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "process-email-lambda",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "mailparser": "^3.6.0"
  }
}
EOF

# Instalar dependências
npm install --production

# Criar zip
zip -r ../lambda-package.zip .

# Limpar
cd .. && rm -rf lambda-deploy
```

### 2. Criar a Lambda no Console AWS

1. Acesse **AWS Lambda** → **Create function**
2. Configurações:
   - Nome: `tempemails-process-email`
   - Runtime: **Node.js 20.x**
   - Architecture: **arm64** (mais barato)

3. Upload do código:
   - **Upload from** → **.zip file**
   - Selecione `lambda-package.zip`

4. Handler: `index.handler`

### 3. Configurar Variáveis de Ambiente

Na aba **Configuration** → **Environment variables**:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `AWS_REGION` | `us-east-1` | Região AWS |
| `INBOX_BUCKET` | `tempemails-inbox` | Bucket onde SES salva emails raw |
| `APP_BUCKET` | `tempemails` | Bucket da aplicação (onde salvar JSON) |

### 4. Configurar Timeout e Memória

Na aba **Configuration** → **General configuration**:

- **Memory**: 256 MB
- **Timeout**: 30 seconds

### 5. Configurar IAM Role

A Lambda precisa de permissões para acessar S3. Na aba **Configuration** → **Permissions**, edite a role e adicione:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::tempemails-inbox/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": ["arn:aws:s3:::tempemails/*"]
    }
  ]
}
```

### 6. Adicionar Permissão para SES

O SES precisa de permissão para invocar a Lambda:

```bash
aws lambda add-permission \
  --function-name tempemails-process-email \
  --statement-id ses-invoke \
  --action lambda:InvokeFunction \
  --principal ses.amazonaws.com \
  --source-account SEU_ACCOUNT_ID
```

### 7. Configurar SES Receipt Rule

1. Acesse **Amazon SES** → **Email receiving** → **Rule sets**
2. Selecione seu rule set (ou crie um novo)
3. Crie/edite uma regra:

**Recipients:**
- `porranenhuma.com`
- `biscoito.email`
- `bolacha.email`
- `tuamaeaquelaursa.email`
- `aquelaursa.email`
- `xablau.email`
- `suamaeaquelaursa.com`

**Actions (em ordem):**

1. **S3 Action**
   - Bucket: `tempemails-inbox`
   - Object key prefix: `emails/`

2. **Lambda Action**
   - Lambda function: `tempemails-process-email`
   - Invocation type: `Event` (async)

## Testar a Lambda

### Evento de teste

No console Lambda, crie um evento de teste com:

```json
{
  "Records": [
    {
      "ses": {
        "mail": {
          "messageId": "test-message-123",
          "destination": ["testuser@porranenhuma.com"]
        }
      }
    }
  ]
}
```

**Nota:** Para testar de verdade, você precisa ter um email raw no S3 em `tempemails-inbox/emails/test-message-123`.

## Logs

Os logs ficam no **CloudWatch Logs**:

```
/aws/lambda/tempemails-process-email
```

## Custos Estimados

| Serviço | Custo |
|---------|-------|
| Lambda | ~$0.20/1M invocações |
| S3 GET | ~$0.0004/1000 requests |
| S3 PUT | ~$0.005/1000 requests |
| SES Inbound | ~$0.10/1000 emails |

**Total estimado:** ~$0.15 por 1000 emails processados.

## Troubleshooting

### Email não aparece na estrutura

1. Verifique CloudWatch Logs da Lambda
2. Confirme que o email raw existe em `emails/{messageId}`
3. Verifique se o JSON foi criado em `{domain}/{slug}/{messageId}.json`

### Erro "NoSuchKey"

O email raw não foi salvo no S3. Verifique:
1. SES Receipt Rule está ativo
2. Bucket `tempemails-inbox` existe
3. Permissões do SES no bucket

### Erro de permissão

Verifique se a IAM Role da Lambda tem permissão de GetObject e PutObject no bucket.
