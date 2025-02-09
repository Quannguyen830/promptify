import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Bucket, s3Client } from "~/config/S3-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); 
  const id = searchParams.get("id");

  const getParam = {
    Bucket: s3Bucket,
    Key: id ?? ""
  };

  if (!id) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  const result = await s3Client.send(new GetObjectCommand(getParam));

  if (result.Body) {
  const bodyContents = await result.Body.transformToString();
  console.log("Body: ", bodyContents);
  
  return NextResponse.json({ 
      message: "Get successful", 
      body: bodyContents 
    });
  }
  return NextResponse.json({ 
    message: "No content found", 
    body: null 
  }, { status: 404 });
}