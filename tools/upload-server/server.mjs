// Local-only image upload server for Cloudflare R2.
// Not deployed to Cloudflare; run with `pnpm upload` and use it only from your machine.
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import express from 'express';
import { imageSize } from 'image-size';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REQUIRED_ENV_VARS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
];

const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.local.example to .env.local and fill in your R2 credentials.');
  process.exit(1);
}

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  PORT = 3333,
} = process.env;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, async (uploadError) => {
    if (uploadError) {
      res.status(400).json({ success: false, error: uploadError.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file provided' });
      return;
    }

    try {
      const { buffer, mimetype, originalname } = req.file;
      const ext = path.extname(originalname) || `.${mimetype.split('/')[1]}`;
      const key = `${randomUUID()}${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        }),
      );

      const { width, height } = imageSize(buffer);

      res.json({
        success: true,
        url: `${R2_PUBLIC_URL}/${key}`,
        key,
        width,
        height,
        format: mimetype.split('/')[1],
        bytes: buffer.length,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Image upload server running at http://localhost:${PORT}`);
  console.log(`Uploading to bucket "${R2_BUCKET_NAME}" -> ${R2_PUBLIC_URL}`);
});
