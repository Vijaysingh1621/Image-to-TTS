# 🖼️➡️🗣️ Image to Voice Converter

A modern full-stack application that converts text in images to natural-sounding speech using advanced OCR and Text-to-Speech technology.

![Image to Voice Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Image+to+Voice+Converter)

## ✨ Features

- 🔍 **Smart OCR** - Extract text from images with high accuracy using Google Cloud Vision API
- 🗣️ **Natural Speech** - Convert text to speech using Google Cloud Text-to-Speech API
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 📱 **Mobile Friendly** - Works perfectly on all devices
- ⚡ **Fast Processing** - Quick conversion with real-time feedback
- 🛡️ **File Validation** - Support for multiple image formats with size limits
- 🔊 **Audio Controls** - Built-in audio player with download options

## 🚀 Live Demo

- **Frontend**: [Deploy on Vercel](https://vercel.com)
- **Backend**: [Deploy on Render](https://render.com)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Google Cloud Vision API** - OCR service
- **Google Cloud Text-to-Speech API** - TTS service

## 📁 Project Structure

```
imagetovoice/
├── frontend/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
├── backend/                  # Node.js backend API
│   ├── index.js
│   ├── package.json
│   ├── temp/                # Temporary file storage
│   └── output/              # Generated audio files
└── README.md
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- Google Cloud account with Vision and Text-to-Speech APIs enabled
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/imagetovoice.git
cd imagetovoice
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Add your Google Cloud credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
cp .env.example .env
# Update VITE_API_URL if needed
npm run dev
```

4. **Google Cloud Setup**
   - Create a Google Cloud project
   - Enable Vision API and Text-to-Speech API
   - Create a service account
   - Download credentials JSON
   - Replace `backend/credentials.json` with your file

## 🚀 Deployment

### Backend on Render

1. **Push to GitHub**
2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your repository
   - Select `backend` folder

3. **Configure Environment**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables:
     ```
     NODE_ENV=production
     GOOGLE_CLOUD_PRIVATE_KEY=your-key
     GOOGLE_CLOUD_CLIENT_EMAIL=your-email
     GOOGLE_CLOUD_PROJECT_ID=your-project-id
     ```

### Frontend on Vercel

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Select `frontend` folder

2. **Configure Environment**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

## 📝 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Detailed health status |
| GET | `/status` | Service configuration status |
| POST | `/upload` | Upload image and convert to speech |

### Upload Endpoint

**POST** `/upload`

**Body**: FormData with `file` field

**Response**: Audio file (MP3)

**Supported Formats**: JPEG, PNG, GIF, BMP, WebP (max 10MB)

## 🔐 Environment Variables

### Backend
```env
NODE_ENV=production
PORT=5000
GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account-email
GOOGLE_CLOUD_PROJECT_ID=your-project-id
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud for Vision and Text-to-Speech APIs
- Tailwind CSS for the beautiful styling system
- React and Vite communities for amazing tools
- Vercel and Render for seamless deployment platforms

## 📧 Contact

Vijay Singh - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/imagetovoice](https://github.com/yourusername/imagetovoice)

---

⭐ Star this repo if you found it helpful!
