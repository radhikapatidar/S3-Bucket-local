// const fs = require('fs');
// const path = require('path');
// const { Upload } = require('@aws-sdk/lib-storage');
// const { GetObjectCommand } = require('@aws-sdk/client-s3');
// const s3 = require('../config/s3');

// const BUCKET_NAME = process.env.S3_BUCKET;

// // **Upload File to MinIO**
// exports.uploadFile = async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//   try {
//     const fileStream = fs.createReadStream(req.file.path);

//     const upload = new Upload({
//       client: s3,
//       params: {
//         Bucket: BUCKET_NAME,
//         Key: req.file.originalname,
//         Body: fileStream,
//         ContentType: req.file.mimetype,
//       },
//     });

//     await upload.done();
//     fs.unlinkSync(req.file.path); // Delete temp file

//     const fileUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${req.file.originalname}`;

//     res.json({ message: 'File uploaded successfully', fileUrl });
//   } catch (error) {
//     console.error('Upload Error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // **Retrieve File from MinIO**
// exports.getFile = async (req, res) => {
//   const fileName = req.params.filename;

//   try {
//     const command = new GetObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: fileName,
//     });

//     const fileUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
//     res.json({ downloadUrl: fileUrl });
//   } catch (error) {
//     console.error('Retrieve Error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };


// const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const s3 = require('../config/s3');

// const BUCKET_NAME = process.env.S3_BUCKET;

// // **Generate Signed URL for Upload**
// exports.getUploadUrl = async (req, res) => {
//   const fileName = req.query.filename;
//   const contentType = req.query.contentType;

//   if (!fileName || !contentType) {
//     return res.status(400).json({ error: 'Filename and contentType are required' });
//   }

//   try {
//     const command = new PutObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: fileName,
//       ContentType: contentType,
//     });

//     const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes expiry
//     res.json({ uploadUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // **Generate Signed URL for Download**
// exports.getDownloadUrl = async (req, res) => {
//   const fileName = req.params.filename;

//   try {
//     const command = new GetObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: fileName,
//     });

//     const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes expiry
//     res.json({ downloadUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const fs = require('fs');
const multer = require('multer');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../config/s3');

const BUCKET_NAME = process.env.S3_BUCKET;

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * @route   GET /api/upload-url
 * @desc    Generate a signed URL for uploading a file
 * @access  Private (Requires Authentication)
 */
exports.getUploadUrl = async (req, res) => {
  const fileName = req.query.filename;
  const contentType = req.query.contentType;

  if (!fileName || !contentType) {
    return res.status(400).json({ error: 'Filename and contentType are required' });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min expiry
    res.json({ uploadUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route   POST /api/upload
 * @desc    Upload a file directly to MinIO
 * @access  Private (Requires Authentication)
 */
exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileStream = fs.createReadStream(req.file.path);

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: req.file.originalname,
    Body: fileStream,
    ContentType: req.file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    fs.unlinkSync(req.file.path);

    res.json({ message: 'File uploaded successfully', fileName: req.file.originalname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route   GET /api/file/:filename
 * @desc    Generate a signed URL for downloading a file
 * @access  Private (Requires Authentication)
 */
exports.getDownloadUrl = async (req, res) => {
  const fileName = req.params.filename;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min expiry
    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
