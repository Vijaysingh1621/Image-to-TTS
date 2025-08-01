const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const util = require('util');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-app.vercel.app'] // Add your Vercel URL here
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  responseOnLimit: "File size limit exceeded"
}));

// Ensure directories exist
const tempDir = path.join(__dirname, 'temp');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check if credentials file exists and is valid
let hasValidCredentials = false;
let credentialsPath;

// In production, try multiple credential sources
if (process.env.NODE_ENV === 'production') {
  // First try environment variable path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  } else {
    credentialsPath = path.join(__dirname, 'credentials.json');
  }
} else {
  credentialsPath = path.join(__dirname, 'credentials.json');
}

try {
  if (fs.existsSync(credentialsPath)) {
    const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
    if (credentialsContent.trim()) {
      const credentials = JSON.parse(credentialsContent);
      if (credentials.private_key && credentials.client_email) {
        hasValidCredentials = true;
      }
    }
  } else if (process.env.GOOGLE_CLOUD_PRIVATE_KEY && process.env.GOOGLE_CLOUD_CLIENT_EMAIL) {
    // Alternative: use environment variables for credentials
    hasValidCredentials = true;
    console.log('Using Google Cloud credentials from environment variables');
  }
} catch (error) {
  console.log('Invalid credentials file format:', error.message);
}

console.log(`Google Cloud credentials status: ${hasValidCredentials ? 'Valid' : 'Missing or Invalid'}`);

// Initialize Google Cloud clients only if credentials are valid
let client, ttsClient;
if (hasValidCredentials) {
  try {
    const vision = require('@google-cloud/vision');
    const textToSpeech = require('@google-cloud/text-to-speech');
    
    let clientConfig = {};
    
    if (process.env.GOOGLE_CLOUD_PRIVATE_KEY && process.env.GOOGLE_CLOUD_CLIENT_EMAIL) {
      // Use environment variables for production
      clientConfig = {
        credentials: {
          private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        },
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      };
    } else {
      // Use credentials file
      clientConfig = {
        keyFilename: credentialsPath
      };
    }
    
    client = new vision.ImageAnnotatorClient(clientConfig);
    ttsClient = new textToSpeech.TextToSpeechClient(clientConfig);
    console.log('Google Cloud services initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Cloud services:', error.message);
    hasValidCredentials = false;
  }
}

// Health check endpoint for deployment platforms
app.get('/', (req, res) => {
  res.json({
    message: 'Image to Voice API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    googleCloudCredentials: hasValidCredentials
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'Server running',
    googleCloudCredentials: hasValidCredentials,
    message: hasValidCredentials 
      ? 'All services available' 
      : 'Google Cloud credentials not configured. Please add valid credentials.',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (!hasValidCredentials) {
      return res.status(503).json({ 
        error: 'Google Cloud services not available',
        message: 'Please configure Google Cloud credentials in credentials.json file. You need to:\n1. Create a Google Cloud project\n2. Enable Vision and Text-to-Speech APIs\n3. Create a service account\n4. Download the credentials JSON file\n5. Replace the empty credentials.json with your downloaded file'
      });
    }

    const file = req.files.file;
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type', 
        message: 'Please upload an image file (JPEG, PNG, GIF, BMP, WebP). PDF files are not supported for OCR.' 
      });
    }

    const filePath = path.join(tempDir, file.name);
    
    console.log(`Uploading file: ${file.name}`);
    console.log(`File type: ${file.mimetype}`);
    console.log(`File path: ${filePath}`);
    
    // Move uploaded file to temp directory
    await file.mv(filePath);

    // OCR
    console.log('Starting OCR...');
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    const text = detections[0]?.description || 'No text found';
    
    console.log(`Extracted text: ${text.substring(0, 100)}...`);

    if (text === 'No text found') {
      // Clean up temp file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: 'No text found in the image',
        message: 'Please ensure the image contains clear, readable text.'
      });
    }

    // TTS
    console.log('Starting text-to-speech...');
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    const outputFile = path.join(outputDir, `output_${Date.now()}.mp3`);
    await util.promisify(fs.writeFile)(outputFile, response.audioContent, 'binary');
    
    console.log(`Audio file created: ${outputFile}`);

    // Clean up temp file
    fs.unlinkSync(filePath);

    // Send the audio file
    res.sendFile(path.resolve(outputFile), { 
      headers: { 'Content-Type': 'audio/mpeg' }
    }, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      } else {
        // Clean up output file after sending
        setTimeout(() => {
          if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
          }
        }, 5000); // Delete after 5 seconds
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Clean up temp file if it exists
    if (req.files?.file) {
      const tempFilePath = path.join(tempDir, req.files.file.name);
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
    
    let errorMessage = 'Internal server error';
    if (error.message.includes('UNKNOWN') || error.message.includes('metadata')) {
      errorMessage = 'Google Cloud authentication error. Please check credentials.';
    } else if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'Google Cloud API quota exceeded. Please try again later.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Temp directory: ${tempDir}`);
  console.log(`Output directory: ${outputDir}`);
  
  if (!hasValidCredentials) {
    console.log('\n⚠️  WARNING: Google Cloud credentials not configured!');
    if (process.env.NODE_ENV === 'production') {
      console.log('For production deployment, set these environment variables:');
      console.log('- GOOGLE_CLOUD_PRIVATE_KEY');
      console.log('- GOOGLE_CLOUD_CLIENT_EMAIL');
      console.log('- GOOGLE_CLOUD_PROJECT_ID');
    } else {
      console.log('To use this service, you need to:');
      console.log('1. Create a Google Cloud project at https://console.cloud.google.com');
      console.log('2. Enable the Vision API and Text-to-Speech API');
      console.log('3. Create a service account and download the JSON key');
      console.log('4. Replace the empty credentials.json file with your downloaded key');
      console.log('5. Restart the server');
    }
    console.log();
  }
});
