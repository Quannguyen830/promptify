import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Bucket, s3Client } from "~/config/S3-client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

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

  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getParam), 
  { expiresIn: 3600 });

  if (result.Body) {
    // Handle different file types differently
    if (fileType == "application/pdf") {
      const buffer = await result.Body.transformToByteArray(); 

      return NextResponse.json({ 
        message: "Get successful", 
        body: buffer.toString(),
        type: 'application/pdf',
        signedUrl: signedUrl
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


// https://promptify-first-bucket.s3.ap-southeast-2.amazonaws.com/cm70baivy000160jfu7mmb05k?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2S2Y4FDTZZ5247Z6%2F20250211%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250211T162030Z&X-Amz-Expires=3600&X-Amz-Signature=691e6dd85cbb82c1a3d1a8210d46ec4028fa4238137171515ecc7fa1d5111049&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject