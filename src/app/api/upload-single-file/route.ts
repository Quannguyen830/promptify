import { type NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from '~/config/S3-client';

const bucketName = process.env.AWS_BUCKET_NAME

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileBuffer = await file.arrayBuffer();
    const originalFileName = formData.get("caption") as string;
    
    // Retrieve user ID from form data
    const userId = formData.get("userId") as string;
    const fileName = userId ? `${userId}/${originalFileName}` : originalFileName;
    const mimetype = file.type;

    const response = await uploadFile(Buffer.from(fileBuffer), fileName, mimetype);
    return NextResponse.json({ message: 'File uploaded successfully', response });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'File upload failed', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'File upload failed', error: 'Unknown error' }, { status: 500 });
  }
}

function uploadFile(fileBuffer: Buffer, fileName: string, mimetype: string) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  }

  return s3Client.send(new PutObjectCommand(uploadParams));
}
