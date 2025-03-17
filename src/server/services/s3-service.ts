import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? "promptify-first-bucket"

export function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
  }

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFileFromS3(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}
