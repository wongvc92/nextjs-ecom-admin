import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

import crypto from "crypto";
import { db } from "../db";
import { galleries } from "../db/schema/galleries";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1048576 * 10; // 1 MB
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
// export const computeSHA256 = async (file: File) => {
//   const buffer = await file.arrayBuffer();
//   const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
//   return hashHex;
// };

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

/**
 * Convert an image URL to a File object.
 *
 * @param {string} imageUrl - The URL of the image to be converted.
 * @param {string} filename - The name to give the converted file.
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @returns {Promise<File>} - A promise that resolves to a File object.
 */
export const urlToFile = async (imageUrl: string, filename: string, mimeType: string): Promise<File> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};
