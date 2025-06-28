'use client';

import { useState } from 'react';

interface UploadResult {
  success: boolean;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  error?: string;
}

interface ImageUploaderProps {
  onUploadComplete?: (result: UploadResult) => void;
  className?: string;
}

export default function ImageUploader({
  onUploadComplete,
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedResult, setUploadedResult] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json() as UploadResult;

      if (result.success) {
        setUploadedResult(result);
        setCopied(false); // Reset copied state for new upload
        onUploadComplete?.(result);
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const generateMarkdown = (result: UploadResult) => {
    return `![Image description](${result.url})`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-600">
              <p className="text-lg">Drop an image here or</p>
              <label className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Supports PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {uploadedResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Upload Successful!
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              Image uploaded: {uploadedResult.width}x{uploadedResult.height} ({(uploadedResult.bytes / 1024).toFixed(1)}KB)
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-700">
                Markdown code (copy and paste into your article):
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generateMarkdown(uploadedResult)}
                  readOnly
                  className="flex-1 px-3 py-2 border border-green-300 rounded bg-white text-gray-900 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(generateMarkdown(uploadedResult))}
                  className={`px-4 py-2 text-white text-sm rounded transition-colors ${
                    copied 
                      ? 'bg-green-500' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadedResult(null);
                setCopied(false);
              }}
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Upload another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}