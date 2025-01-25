import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/config/S3-client";
import { type S3File } from "~/interface";

const bucketName = process.env.AWS_BUCKET_NAME

export function uploadFileToS3(fileBuffer: Buffer, fileName: string, mimetype: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
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

export async function getFilesFromS3(userId: string): Promise<S3File[]> {
  const getParam = {
    Bucket: bucketName,
    Prefix: userId,
  };

  const response = await s3Client.send(new ListObjectsV2Command(getParam));
  
  return response.Contents?.map(item => ({
    Key: extractFileName(item.Key ?? ""),
    LastModified: item.LastModified ?? new Date(),
    Size: item.Size ?? 0,
    ETag: item.ETag ?? "",
  })) ?? [];
}

function extractFileName(fileName: string) {
  return fileName.split('/').pop() ?? fileName;
}