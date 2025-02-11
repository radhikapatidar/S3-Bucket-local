// require('dotenv').config();
// const { S3Client } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//   endpoint: process.env.S3_ENDPOINT, // MinIO URL
//   region: 'us-east-1',
//   forcePathStyle: true,
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_KEY,
//   },
// });

// module.exports = s3;



require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1',
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

module.exports = s3;
