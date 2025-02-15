"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config");
const s3Client = new client_s3_1.S3Client({
    region: config_1.config.aws.region,
    credentials: {
        accessKeyId: config_1.config.aws.accessKeyId,
        secretAccessKey: config_1.config.aws.secretAccessKey,
    },
});
const uploadToS3 = async (file) => {
    const key = `uploads/${Date.now()}-${file.originalname}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: config_1.config.aws.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    });
    await s3Client.send(command);
    return `https://${config_1.config.aws.bucketName}.s3.${config_1.config.aws.region}.amazonaws.com/${key}`;
};
exports.uploadToS3 = uploadToS3;
