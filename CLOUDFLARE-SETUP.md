# Configuracao Cloudflare (Email + R2)

Guia completo para configurar o recebimento de emails usando Cloudflare Email Routing + Workers + R2.

## Vantagens

- **Gratuito**: 100.000 emails/dia, 10GB R2
- **Simples**: Configuracao automatica de DNS
- **Rapido**: Edge network global
- **S3-compativel**: Funciona com o codigo existente

---

## Pre-requisitos

- Conta Cloudflare (gratuita)
- Dominios adicionados ao Cloudflare
- Node.js instalado
- Wrangler CLI: `npm install -g wrangler`

---

## Passo 1: Criar bucket R2

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Va em **R2** no menu lateral
3. Clique em **Create bucket**
4. Nome: `magic-mails-inboxes`
5. Clique em **Create bucket**

---

## Passo 2: Criar API Token para R2

1. No dashboard R2, clique em **Manage R2 API Tokens**
2. Clique em **Create API token**
3. Permissoes: **Object Read & Write**
4. Escopo: Selecione o bucket `magic-mails-inboxes`
5. Clique em **Create API Token**
6. **IMPORTANTE**: Copie e salve:
   - Access Key ID
   - Secret Access Key
   - Account ID (visivel na URL do dashboard)

---

## Passo 3: Ativar Email Routing

Para **cada dominio** (ex: xablau.email):

1. Selecione o dominio no dashboard
2. Va em **Email** > **Email Routing**
3. Clique em **Enable Email Routing**
4. O Cloudflare adiciona os registros MX automaticamente
5. Aguarde propagacao DNS (pode levar alguns minutos)

---

## Passo 4: Deploy do Worker

```bash
# Entrar na pasta do worker
cd cloudflare-worker

# Login no Cloudflare
wrangler login

# Deploy
wrangler deploy
```

---

## Passo 5: Configurar Email Worker

1. No dashboard, va em **Email** > **Email Routing**
2. Clique na aba **Email Workers**
3. Clique em **Create** ou selecione o worker `magic-mails-worker`
4. Va para **Routing rules**
5. Configure uma regra **Catch-all**:
   - Action: **Send to a Worker**
   - Destination: `magic-mails-worker`
6. Repita para cada dominio

---

## Passo 6: Configurar variaveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=sua_access_key
R2_SECRET_ACCESS_KEY=sua_secret_key
R2_BUCKET=magic-mails-inboxes
```

---

## Passo 7: Deploy do frontend

### Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Adicionar variaveis de ambiente
vercel env add R2_ACCOUNT_ID production
vercel env add R2_ACCESS_KEY_ID production
vercel env add R2_SECRET_ACCESS_KEY production
vercel env add R2_BUCKET production
```

### Cloudflare Pages (alternativa)

```bash
# Na raiz do projeto
npm run build

# Deploy para Pages
wrangler pages deploy .next
```

---

## Testar

1. Crie uma caixa no site (ex: `teste123@xablau.email`)
2. Envie um email para esse endereco
3. Verifique no inbox se chegou

---

## Estrutura de arquivos no R2

```
magic-mails-inboxes/
├── _meta/
│   ├── boxes.json           # Indice de todas as caixas
│   └── tokens/
│       └── {token}.json     # Lookup token -> slug/domain
├── {domain}/
│   └── {slug}/
│       ├── meta.json        # Metadados da caixa
│       └── messages/
│           └── {id}.json    # Mensagens
```

---

## Troubleshooting

### Email nao chega

1. Verifique se o Email Routing esta ativo
2. Verifique se a regra catch-all esta configurada
3. Verifique os logs do Worker: `wrangler tail`

### Erro de permissao R2

1. Verifique se o API token tem permissao Read & Write
2. Verifique se o bucket esta correto no wrangler.toml

### Worker nao processa

1. Verifique se o binding R2 esta correto
2. Veja os logs: `wrangler tail magic-mails-worker`

---

## Custos estimados

| Recurso | Limite gratuito | Custo adicional |
|---------|-----------------|-----------------|
| Email Routing | 100k emails/dia | - |
| R2 Storage | 10 GB | $0.015/GB |
| R2 Operations | 10M Class A, 1M Class B | $4.50/M, $0.36/M |
| Workers | 100k req/dia | $5/10M req |

Para a maioria dos casos de uso, voce ficara dentro do limite gratuito.

---

## Comandos uteis

```bash
# Ver logs do worker em tempo real
wrangler tail magic-mails-worker

# Atualizar worker
cd cloudflare-worker && wrangler deploy

# Listar objetos no R2
wrangler r2 object list magic-mails-inboxes

# Ver conteudo de um objeto
wrangler r2 object get magic-mails-inboxes/xablau.email/teste/meta.json
```
