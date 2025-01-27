import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.AWS_BUCKET_NAME

export function uploadFileToS3(fileBuffer: Buffer, fileName: string, userId: string) {
  const fileIdOnS3 = userId ? `${userId}/${fileName}` : fileName;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileIdOnS3,
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

export function extractFileId(fileName: string) {
  return fileName.split("/").pop();
}