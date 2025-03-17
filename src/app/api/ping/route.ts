import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { s3Bucket, s3Client } from "~/config/S3-client";

export async function POST(request: NextRequest) {
    try {
        const s3Response = await s3Client.send(new GetObjectCommand({
            Bucket: s3Bucket,
            Key: 'cm77k2yzh0001l9ja0bm1g1b9'
        }));

        if (!s3Response.Body) {
            throw new Error('No document body received from S3');
        }

        return NextResponse.json(s3Response.Body.transformToString());

    } catch (error) {
        console.error('Error processing document:', error);
        return NextResponse.json(
            { error: 'Error processing document' },
            { status: 500 }
        );
    }
}