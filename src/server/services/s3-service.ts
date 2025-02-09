import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.AWS_BUCKET_NAME

export function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
  }

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function createNewFolderToS3(folderName: string) {
  const uploadParams = {
    Bucket: bucketName,
    Key: folderName,
    Body: "",
    ContentType: "application/x-directory"
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}

export async function listFileFromS3(userId: string) {
  const getParam = {
    Bucket: bucketName,
    Prefix: userId,
  };

  const response = await s3Client.send(new ListObjectsV2Command(getParam));
  
  return response.Contents;
}

export async function getFileFromS3(fileId: string) {
  const param = {
    Bucket: bucketName,
    Key: fileId
  }

  const response = await s3Client.send(new GetObjectCommand(param));

  return response;
}
