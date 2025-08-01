# Image to Voice Backend API

Backend service for converting images with text to speech using Google Cloud Vision (OCR) and Text-to-Speech APIs.

## Features

- 🖼️ Optical Character Recognition (OCR) from images
- 🗣️ Text-to-Speech conversion
- 📁 File upload handling
- 🔄 Automatic file cleanup
- 🛡️ Error handling and validation
- 🚀 Production-ready for deployment

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure Google Cloud credentials (see deployment section)

4. Start the development server:
```bash
npm run dev
```

## Deployment on Render

### 1. Prepare Your Repository
- Ensure all files are committed to your Git repository
- Push to GitHub/GitLab

### 2. Create Render Service
1. Go to [Render.com](https://render.com)
2. Connect your repository
3. Create a new "Web Service"
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### 3. Set Environment Variables
In Render dashboard, add these environment variables:

```
NODE_ENV=production
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key-here
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLOUD_PROJECT_ID=your-project-id
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### 4. Google Cloud Setup
1. Create a Google Cloud project
2. Enable Vision API and Text-to-Speech API
3. Create a service account with appropriate permissions
4. Download the JSON credentials
5. Copy the values to environment variables above

**Important**: For the private key, copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, but replace actual newlines with `\\n`.

### 5. Deploy
- Render will automatically deploy when you push to your main branch
- Your API will be available at: `https://your-app-name.onrender.com`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /status` - Service status and configuration
- `POST /upload` - Upload image and get audio

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (production/development) | No |
| `PORT` | Server port (default: 5000) | No |
| `GOOGLE_CLOUD_PRIVATE_KEY` | Google Cloud service account private key | Yes |
| `GOOGLE_CLOUD_CLIENT_EMAIL` | Google Cloud service account email | Yes |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## File Structure

```
backend/
├── index.js                 # Main server file
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── credentials.json.example # Google Cloud credentials template
├── temp/                 # Temporary uploaded files
└── output/              # Generated audio files
```
