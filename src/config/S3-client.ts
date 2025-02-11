import { S3Client } from "@aws-sdk/client-s3"

const region = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET

if (!region) {
  throw new Error('Missing AWS region');
}
if (!accessKeyId) {
  throw new Error('Missing AWS access key ID');
}
if (!secretAccessKey) {
  throw new Error('Missing AWS secret access key');
}
export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export const s3Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME