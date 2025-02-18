import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3Client } from "~/config/S3-client";
import { s3Bucket } from "~/config/S3-client";

export async function GET() {
  const getParam = {
    Bucket: s3Bucket,
    Key: "cm77k2yzh0001l9ja0bm1g1b9"
  };

  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getParam), { expiresIn: 3600 });
  
  return NextResponse.json({ signedUrl: signedUrl });
}
