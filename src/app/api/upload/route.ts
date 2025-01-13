import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET

if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing AWS credentials');
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

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
