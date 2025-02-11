// const express = require('express');
// const multer = require('multer');
// const { uploadFile, getFile } = require('../controllers/fileController');

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.post('/upload', upload.single('file'), uploadFile);
// router.get('/file/:filename', getFile);

// module.exports = router;



// const express = require('express');
// const { getUploadUrl, getDownloadUrl } = require('../controllers/fileController');
// const { authenticate, generateToken } = require('../middleware/auth');

// const router = express.Router();

// router.get('/auth/token', generateToken); // Generate token for testing
// router.get('/upload-url', authenticate, getUploadUrl); // Get signed URL for upload
// router.get('/file/:filename', authenticate, getDownloadUrl); // Get signed URL for download

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { getUploadUrl, uploadFile, getDownloadUrl } = require('../controllers/fileController');
const { authenticate, generateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/auth/token', generateToken); // Generate auth token
router.get('/upload-url', authenticate, getUploadUrl); // Get signed upload URL
router.post('/upload', authenticate, upload.single('file'), uploadFile); // Upload file directly
router.get('/file/:filename', authenticate, getDownloadUrl); // Get signed download URL

module.exports = router;
