import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const deleteImageFromS3 = async (url: string) => {
  const key = url.split(".com/")[1];
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    throw new Error("Failed delete image, please try again later");
  }
};

export const getSignedURLFromS3 = async (type: string, size: number, checksum: string): Promise<{ signedURL: string; fileUrl: string }> => {
  //upload file to s3
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(), //generate random unique file name
    ContentType: type, //get from client
    ContentLength: size, //get from client
    ChecksumSHA256: checksum,
    // Metadata: {
    //   userId: userId, //extra info
    // },
  });

  //get signedurl from aws
  let signedURL;
  try {
    signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });
  } catch (error) {
    throw new Error("Failed update image, please try again later");
  }
  const fileUrl = signedURL.split("?")[0];
  return { fileUrl, signedURL };
};
