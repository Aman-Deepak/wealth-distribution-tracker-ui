// src/pages/upload/Upload.tsx
import React, { useState, useRef } from 'react';
import { uploadAPI } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';

interface UploadHistoryItem {
  filename: string;
  file_type: string;
  upload_time?: string;
  status?: string;
}

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);

  const {
    data: history,
    refetch: refetchHistory,
    isLoading: loadingHistory,
  } = useQuery<UploadHistoryItem[]>({
    queryKey: ['uploadHistory'],
    queryFn: () => uploadAPI.getUploadHistory(),
  });

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropRef.current) {
      dropRef.current.classList.add('ring-4', 'ring-primary-400', 'ring-opacity-50');
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropRef.current) {
      dropRef.current.classList.remove('ring-4', 'ring-primary-400', 'ring-opacity-50');
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropRef.current) {
      dropRef.current.classList.remove('ring-4', 'ring-primary-400', 'ring-opacity-50');
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setMessage('');
      setProgress(0);
      e.dataTransfer.clearData();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setMessage('');
      setProgress(0);
    }
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      await uploadAPI.uploadFile(file, (prog) => {
        setProgress(prog);
      });
      setMessage('Upload successful!');
      setFile(null);
      refetchHistory();
    } catch {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Upload Your Financial Data</h1>
          <p className="mt-4 text-lg text-gray-600">
            Securely upload Excel or CSV files to keep your wealth tracker up to date.
          </p>
        </div>

        {/* Upload Card */}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="border-4 border-dashed border-indigo-300 rounded-xl bg-white p-8 text-center cursor-pointer hover:border-primary-600 transition mb-10 focus:outline-none focus:ring-4 focus:ring-primary-400 focus:ring-opacity-50"
          tabIndex={0}
        >
          <label
            htmlFor="file-upload"
            className="block text-primary-700 text-lg font-semibold"
          >
            {file ? file.name : 'Drag and drop your file here, or click to browse'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.csv"
            onChange={onFileChange}
            className="sr-only"
          />
          {file && (
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-2">
                <progress
                  value={progress}
                  max="100"
                  className="w-full h-4 rounded-full overflow-hidden bg-indigo-100"
                  style={{
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                  }}
                />
                <span className="text-indigo-600 font-medium min-w-[45px]">{progress}%</span>
              </div>
              <Button
                onClick={onUpload}
                disabled={!file || uploading}
                className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              {message && (
                <p
                  className={`mt-4 text-center font-medium ${
                    message.includes('failed') ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upload History */}
        <Card>
          <CardHeader title="Upload History" />
          <CardBody className="overflow-x-auto">
            {loadingHistory ? (
              <p className="text-center text-gray-500 py-6">Loading upload history…</p>
            ) : !history || history.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No uploads yet.</p>
            ) : (
              <table className="min-w-full text-left divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-600">Filename</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-600">File Type</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-600">Uploaded On</th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <tr key={`${item.filename}-${item.upload_time ?? ''}`} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{item.filename}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.file_type}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {item.upload_time ? new Date(item.upload_time).toLocaleString() : 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status ?? 'Success'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
