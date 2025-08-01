import React from 'react';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    
    // Client-side file type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an image file (JPEG, PNG, GIF, BMP, WebP). PDF files are not supported.');
      return;
    }
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'audio/mpeg' }));
      setAudioURL(url);
    } catch (err) {
      console.error('Upload error:', err);
      
      if (err.response?.data) {
        // Try to parse error message from response
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              setError(errorData.message || errorData.error || 'Upload failed');
            } catch {
              setError('Upload failed. Please try again.');
            }
          };
          reader.readAsText(err.response.data);
        } catch {
          setError('Upload failed. Please try again.');
        }
      } else if (err.response?.status === 400) {
        setError('Invalid file or no text found in the image. Please try uploading an image with visible text.');
      } else if (err.response?.status === 503) {
        setError('Service temporarily unavailable. Google Cloud credentials need to be configured.');
      } else if (err.response?.status === 500) {
        setError('Server error occurred. Please check if the backend server is running and properly configured.');
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image to Voice Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform text in images into natural-sounding speech using advanced OCR and text-to-speech technology
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* File Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Image File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={e => setFile(e.target.files[0])}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  file 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className="flex flex-col items-center">
                    {file ? (
                      <>
                        <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-700">{file.name}</p>
                        <p className="text-xs text-green-600 mt-1">File selected successfully</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Click to upload an image</p>
                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, BMP, WebP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg transition-all duration-200 ${
                  loading || !file
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Convert to Speech
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Audio Player Section */}
            {audioURL && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Generated Audio</h3>
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <audio 
                    controls 
                    src={audioURL}
                    className="w-full"
                    style={{outline: 'none'}}
                  ></audio>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  🎉 Your audio is ready! Click play to listen to the converted speech.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart OCR</h3>
            <p className="text-gray-600 text-sm">Advanced optical character recognition extracts text from any image with high accuracy.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Speech</h3>
            <p className="text-gray-600 text-sm">Convert extracted text to natural-sounding speech using state-of-the-art TTS technology.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">Quick and efficient processing ensures you get your audio output in seconds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
