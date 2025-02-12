


const express = require('express');
const multer = require('multer');
const { getUploadUrl, uploadFile, getFileUrl } = require('../controllers/fileController');
const { authenticate, generateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/auth/token', generateToken); // Generate auth token
// router.get('/upload-url', authenticate, getUploadUrl); // Get signed upload URL
router.post('/upload', authenticate, upload.single('file'), uploadFile); // Upload file directly
router.get('/file/:filename', authenticate, getFileUrl); // Get signed download URL

module.exports = router;
