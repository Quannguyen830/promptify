import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Client } from "~/config/S3-client";

const bucketName = process.env.AWS_BUCKET_NAME;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const folderName = formData.get("folderName") as string; // Get the folder name from form data

    // Retrieve user ID from form data
    const userId = formData.get("userId") as string;
    const fullFolderName = userId ? `${userId}/${folderName}/` : `${folderName}/`; // Ensure the folder name ends with a slash

    // Create the new folder in S3
    const response = await createNewFolder(fullFolderName);
    return NextResponse.json({ message: 'Folder created successfully', response });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Folder creation failed', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Folder creation failed', error: 'Unknown error' }, { status: 500 });
  }
}

function createNewFolder(folderName: string) {
  const uploadParams = {
    Bucket: bucketName,
    Key: folderName,
    Body: "",
    ContentType: "application/x-directory"
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
}