import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { AppLogger } from "../../core/logging/logger";

export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.RUSTFS_BUCKET || "f4rooq";
    this.s3Client = new S3Client({
      region: process.env.RUSTFS_REGION || "us-east-1",
      endpoint: process.env.RUSTFS_ENDPOINT || "https://f4rooq.s3.amanillah.link",
      credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY || "rustfsadmin",
        secretAccessKey: process.env.RUSTFS_SECRET_KEY || "uwjibs8jehzktnqb",
      },
      forcePathStyle: true,
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const extension = path.extname(file.originalname);
      const filename = `${uuidv4()}${extension}`;
      const key = `uploads/${filename}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const endpoint = process.env.RUSTFS_ENDPOINT || "https://f4rooq.s3.amanillah.link";
      const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
      
      return `${baseUrl}/${this.bucketName}/${key}`;
    } catch (error) {
      AppLogger.error("Error uploading file to S3:", { error });
      throw new Error("Failed to upload file");
    }
  }
}
