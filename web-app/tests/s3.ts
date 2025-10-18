import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure MinIO client
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1', // MinIO doesn't care about region, but SDK requires it
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin123',
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET_NAME = 'xstream';

// Upload a file
export async function uploadFile(
  key: string,
  body: Buffer | string,
  contentType?: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  console.log(`File uploaded: ${key}`);
}

// Download a file
export async function downloadFile(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  const chunks: Uint8Array[] = [];
  
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

// List all files
export async function listFiles(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map(obj => obj.Key!) || [];
}

// Delete a file
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  console.log(`File deleted: ${key}`);
}

// Generate a presigned URL (for direct browser uploads/downloads)
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

// Example usage
async function main() {
  try {
    // Upload
    await uploadFile('test.txt', 'Hello MinIO!', 'text/plain');

    // List files
    const files = await listFiles();
    console.log('Files:', files);

    // Download
    const content = await downloadFile('test.txt');
    console.log('Content:', content.toString());

    // Get presigned URL
    const url = await getPresignedUrl('test.txt');
    console.log('Presigned URL:', url);

    // Delete
    // await deleteFile('test.txt');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run
main();