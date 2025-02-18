import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import pdf from 'pdf-parse';
import { s3Bucket, s3Client } from "~/config/S3-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); 
  const id = searchParams.get("id");
  const fileType = searchParams.get("fileType");

  const getParam = {
    Bucket: s3Bucket,
    Key: id ?? ""
  };

  if (!id) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  const result = await s3Client.send(new GetObjectCommand(getParam));

  const contentType = result.ContentType?.toLowerCase();

  if (result.Body) {
    // Handle different file types differently
    if (fileType == "application/pdf") {
      const buffer = await result.Body.transformToByteArray(); 

      return NextResponse.json({ 
        message: "Get successful", 
        body: buffer.toString(),
        type: 'application/pdf'
      });
    } else {
      // For text files, continue with the current approach
      const bodyContents = await result.Body.transformToString();
      return NextResponse.json({ 
        message: "Get successful", 
        body: bodyContents,
        type: contentType
      });
    }
  }

  return NextResponse.json({ 
    message: "No content found", 
    body: "No content found" 
  }, { status: 404 });
}
