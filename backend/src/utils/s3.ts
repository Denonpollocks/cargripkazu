import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const key = `uploads/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  return `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
}; 