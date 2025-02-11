// import { type GetObjectCommandOutput } from '@aws-sdk/client-s3';
// import pdfParse, { type Result } from 'pdf-parse';

// export async function extractFileContent(result: GetObjectCommandOutput) {
//   if (!result.Body) {
//     throw new Error('No content found');
//   }

//   const contentType = result.ContentType?.toLowerCase();

//   if (contentType === 'application/pdf' || contentType === 'application/octet-stream') {
//     // Handle PDF
//     const byteArray = await result.Body.transformToByteArray();
//     const buffer = Buffer.from(byteArray);

//     const pdfData = await pdfParse(buffer) as Result;
//     return pdfData.text;
//   } else {
//     // Handle text files
//     return await result.Body.transformToString();
//   }
// }