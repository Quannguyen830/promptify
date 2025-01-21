import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.AWS_BUCKET_NAME;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); 
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const result = await getFiles(userId);
  return NextResponse.json({ "Response": result });
}

async function getFiles(userId: string) {
  const getParam = {
    Bucket: bucketName,
    Prefix: userId,
  };

  const response = await s3Client.send(new ListObjectsV2Command(getParam));
  return response.Contents;
}