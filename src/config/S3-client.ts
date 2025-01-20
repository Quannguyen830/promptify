import { S3Client } from "@aws-sdk/client-s3"

const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET

export const geminiApiKey = process.env.GEMINI_API_KEY ?? ""

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing AWS credentials');
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})