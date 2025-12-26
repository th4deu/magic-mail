import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Box, Message, BoxesIndex, TokenLookup } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

// Check if R2 (Cloudflare) is configured
const isR2Configured = !!(
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ACCOUNT_ID
);

// Check if AWS S3 is configured
const isAwsConfigured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET
);

// Prioriza R2, depois AWS, depois storage local
const s3Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    })
  : isAwsConfigured
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    })
  : null;

const BUCKET = process.env.R2_BUCKET || process.env.AWS_S3_BUCKET || 'magic-mails-inboxes';

// File-based storage for development (when S3 is not configured)
const DEV_STORAGE_DIR = path.join(process.cwd(), '.dev-storage');

function ensureDevStorageDir(): void {
  if (!fs.existsSync(DEV_STORAGE_DIR)) {
    fs.mkdirSync(DEV_STORAGE_DIR, { recursive: true });
  }
}

function getFilePath(key: string): string {
  // Replace / with _ to create flat file structure
  const safeKey = key.replace(/\//g, '__');
  return path.join(DEV_STORAGE_DIR, safeKey);
}

// Debug function to see all stored keys
export function debugGetAllKeys(): string[] {
  if (!fs.existsSync(DEV_STORAGE_DIR)) {
    return [];
  }
  return fs.readdirSync(DEV_STORAGE_DIR).map(f => f.replace(/__/g, '/'));
}

export function debugGetStorage(): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!fs.existsSync(DEV_STORAGE_DIR)) {
    return result;
  }
  for (const file of fs.readdirSync(DEV_STORAGE_DIR)) {
    const key = file.replace(/__/g, '/');
    const filePath = path.join(DEV_STORAGE_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      result[key] = JSON.parse(content);
    } catch {
      // ignore
    }
  }
  return result;
}

async function getObject<T>(key: string): Promise<T | null> {
  // Use file storage if S3 is not configured
  if (!s3Client) {
    const filePath = getFilePath(key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString();
    return body ? JSON.parse(body) : null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'NoSuchKey') {
      return null;
    }
    throw error;
  }
}

async function putObject(key: string, data: unknown): Promise<void> {
  // Use file storage if S3 is not configured
  if (!s3Client) {
    ensureDevStorageDir();
    const filePath = getFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return;
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  });
  await s3Client.send(command);
}

async function deleteObject(key: string): Promise<void> {
  // Use file storage if S3 is not configured
  if (!s3Client) {
    const filePath = getFilePath(key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return;
  }

  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3Client.send(command);
}

// Box operations
export async function getBoxesIndex(): Promise<BoxesIndex> {
  const index = await getObject<BoxesIndex>('_meta/boxes.json');
  return index || {};
}

export async function saveBoxesIndex(index: BoxesIndex): Promise<void> {
  await putObject('_meta/boxes.json', index);
}

export async function getTokenLookup(token: string): Promise<TokenLookup | null> {
  return getObject<TokenLookup>(`_meta/tokens/${token}.json`);
}

export async function saveTokenLookup(token: string, data: TokenLookup): Promise<void> {
  await putObject(`_meta/tokens/${token}.json`, data);
}

export async function deleteTokenLookup(token: string): Promise<void> {
  await deleteObject(`_meta/tokens/${token}.json`);
}

export async function getBoxMeta(domain: string, slug: string): Promise<Box | null> {
  return getObject<Box>(`${domain}/${slug}/meta.json`);
}

export async function saveBoxMeta(domain: string, slug: string, data: Box): Promise<void> {
  await putObject(`${domain}/${slug}/meta.json`, data);
}

export async function deleteBoxMeta(domain: string, slug: string): Promise<void> {
  await deleteObject(`${domain}/${slug}/meta.json`);
}

// Message operations
export async function getMessage(domain: string, slug: string, messageId: string): Promise<Message | null> {
  return getObject<Message>(`${domain}/${slug}/messages/${messageId}.json`);
}

export async function saveMessage(domain: string, slug: string, message: Message): Promise<void> {
  await putObject(`${domain}/${slug}/messages/${message.id}.json`, message);
}

export async function deleteMessage(domain: string, slug: string, messageId: string): Promise<void> {
  await deleteObject(`${domain}/${slug}/messages/${messageId}.json`);
}

export async function listMessages(domain: string, slug: string): Promise<Message[]> {
  const prefix = `${domain}/${slug}/messages/`;

  // Use file storage if S3 is not configured
  if (!s3Client) {
    const messages: Message[] = [];
    if (fs.existsSync(DEV_STORAGE_DIR)) {
      const filePrefix = prefix.replace(/\//g, '__');
      for (const file of fs.readdirSync(DEV_STORAGE_DIR)) {
        if (file.startsWith(filePrefix) && file.endsWith('.json')) {
          const filePath = path.join(DEV_STORAGE_DIR, file);
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            messages.push(JSON.parse(content) as Message);
          } catch {
            // ignore
          }
        }
      }
    }
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return messages;
  }

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  const messages: Message[] = [];

  if (response.Contents) {
    for (const item of response.Contents) {
      if (item.Key && item.Key.endsWith('.json')) {
        const message = await getObject<Message>(item.Key);
        if (message) {
          messages.push(message);
        }
      }
    }
  }

  // Sort by createdAt descending (newest first)
  messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return messages;
}

export async function deleteAllMessages(domain: string, slug: string): Promise<void> {
  const prefix = `${domain}/${slug}/messages/`;

  // Use file storage if S3 is not configured
  if (!s3Client) {
    if (fs.existsSync(DEV_STORAGE_DIR)) {
      const filePrefix = prefix.replace(/\//g, '__');
      for (const file of fs.readdirSync(DEV_STORAGE_DIR)) {
        if (file.startsWith(filePrefix)) {
          fs.unlinkSync(path.join(DEV_STORAGE_DIR, file));
        }
      }
    }
    return;
  }

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);

  if (response.Contents) {
    for (const item of response.Contents) {
      if (item.Key) {
        await deleteObject(item.Key);
      }
    }
  }
}

// Check if box exists (by slug and domain)
export async function boxExists(domain: string, slug: string): Promise<boolean> {
  const meta = await getBoxMeta(domain, slug);
  return meta !== null;
}

// Get box by token
export async function getBoxByToken(token: string): Promise<Box | null> {
  const lookup = await getTokenLookup(token);
  if (!lookup) return null;

  return getBoxMeta(lookup.domain, lookup.slug);
}

// Delete entire box
export async function deleteBox(domain: string, slug: string, token: string): Promise<void> {
  // Delete all messages
  await deleteAllMessages(domain, slug);

  // Delete meta
  await deleteBoxMeta(domain, slug);

  // Delete token lookup
  await deleteTokenLookup(token);

  // Update boxes index
  const index = await getBoxesIndex();
  delete index[`${domain}:${slug}`];
  await saveBoxesIndex(index);
}
