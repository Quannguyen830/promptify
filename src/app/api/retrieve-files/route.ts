import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.AWS_BUCKET_NAME

export async function GET(request: NextRequest) {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  const result = getFiles(userId);
  return NextResponse.json({"Response: ": result})
}

function getFiles(userId: string) {
  const getParam = {
    Bucket: bucketName,
    Prefix: userId,
  }

  return s3Client.send(new ListObjectsV2Command(getParam));
}