# Image to Voice Frontend

Modern, responsive frontend for the Image to Voice conversion application built with React, Vite, and Tailwind CSS.

## Features

- 🎨 Beautiful, modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🖼️ Drag & drop file upload
- ⚡ Real-time upload progress
- 🔊 Audio playback controls
- 🛡️ Client-side file validation
- 🚀 Optimized for production deployment

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## Deployment on Vercel

### 1. Prepare Your Repository
- Ensure all files are committed to your Git repository
- Push to GitHub/GitLab

### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Set Environment Variables
In Vercel dashboard, add:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

### 4. Custom Domain (Optional)
- Add your custom domain in Vercel settings
- Update CORS settings in backend with your domain

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Vercel** - Deployment platform

## File Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx            # Application entry point
│   ├── App.css             # Application styles
│   └── index.css           # Global styles & Tailwind imports
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
├── .env.example          # Environment variables template
└── .gitignore           # Git ignore rules
```

## Supported File Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)

Maximum file size: 10MB+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
