
const fs = require('fs');
const multer = require('multer');
const { PutObjectCommand, GetObjectCommand,HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mime = require('mime-types');
const s3 = require('../config/s3');

const BUCKET_NAME = process.env.S3_BUCKET;

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

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

exports.getFileUrl = async (req, res) => {
  const fileName = req.params.filename;
  const fileExtension = fileName.split('.').pop(); // Extract file extension
  const contentType = mime.lookup(fileExtension) || 'application/octet-stream'; // Get MIME type

  try {
    // Generate a signed URL for GET request (valid for 5 minutes)
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ResponseContentDisposition: 'inline', // Ensures file opens in browser if supported
      ResponseContentType: contentType, // Set correct Content-Type
    });

    const fileUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 5 min expiry for download

    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


