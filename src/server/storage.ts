import { S3Client, PutObjectCommand, type S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env["R2_ACCOUNT_ID"];
const ACCESS_KEY_ID = process.env["R2_ACCESS_KEY_ID"] || process.env["AWS_ACCESS_KEY_ID"];
const SECRET_ACCESS_KEY =
  process.env["R2_SECRET_ACCESS_KEY"] || process.env["AWS_SECRET_ACCESS_KEY"];
const BUCKET_NAME =
  process.env["R2_BUCKET_NAME"] || process.env["S3_BUCKET_NAME"] || "dharohar-citizen-archives";
const PUBLIC_BASE_URL =
  process.env["R2_PUBLIC_URL"] ||
  process.env["S3_PUBLIC_URL"] ||
  `https://${BUCKET_NAME}.r2.dev`;

const ENDPOINT =
  process.env["R2_ENDPOINT"] ||
  (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

const REGION = process.env["AWS_REGION"] || "auto";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client | null {
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return null;
  }
  if (!s3Client) {
    const config: S3ClientConfig = {
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
      ...(ENDPOINT ? { endpoint: ENDPOINT } : {}),
    };
    s3Client = new S3Client(config);
  }
  return s3Client;
}

export type PresignedUrlResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  isSimulated: boolean;
};

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string,
): Promise<PresignedUrlResult> {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const key = `citizen-archives/${Date.now()}-${randomSuffix}-${sanitized}`;

  const client = getS3Client();

  if (!client) {
    // Development / demo fallback: return simulated upload endpoint if S3 / R2 credentials are not set
    return {
      uploadUrl: `/api/public/mock-upload?key=${encodeURIComponent(key)}`,
      publicUrl: `${PUBLIC_BASE_URL}/${key}`,
      key,
      isSimulated: true,
    };
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // Valid for 15 minutes (900 seconds)
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  return {
    uploadUrl,
    publicUrl: `${PUBLIC_BASE_URL}/${key}`,
    key,
    isSimulated: false,
  };
}
