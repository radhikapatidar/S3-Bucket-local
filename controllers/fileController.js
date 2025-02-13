const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
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
 * @desc    Single URL for both Viewing & Downloading
 *          - If `?download=true` is provided, forces file download
 *          - Otherwise, streams file directly for viewing
 * @access  Private (Requires Authentication)
 */
exports.getFileUrl = async (req, res) => {
  const fileName = req.params.filename;

  try {
    // Generate a signed URL that allows viewing and downloading
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ResponseContentDisposition: 'inline', // View file in browser, but allows manual download
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 5 min expiry

    res.json({ fileUrl: signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

