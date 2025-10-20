import React, { useState, useCallback, useMemo } from 'react';
import { extractTextFromImage } from './services/geminiService';

// --- Icon Components --- //
const UploadIcon = () => (
  <svg className="w-12 h-12 mb-4 text-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
  </svg>
);

const CopyIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z"/>
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
    </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 1.944A8.056 8.056 0 0 0 1.944 10 8.056 8.056 0 0 0 10 18.056 8.056 8.056 0 0 0 18.056 10 8.056 8.056 0 0 0 10 1.944ZM5.063 12.316a1 1 0 0 1-.707-.293l-1-1a1 1 0 1 1 1.414-1.414l1 1a1 1 0 0 1-.707 1.707Zm1.414-5.658a1 1 0 0 1 0-1.414l1-1a1 1 0 0 1 1.414 1.414l-1 1a1 1 0 0 1-1.414 0Zm8.523 5.658a1 1 0 0 1-.707-.293l-1-1a1 1 0 1 1 1.414-1.414l1 1a1 1 0 0 1-.707 1.707Zm-1.414-5.658a1 1 0 0 1 0-1.414l1-1a1 1 0 1 1 1.414 1.414l-1 1a1 1 0 0 1-1.414 0ZM10 6a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-4 5a1 1 0 0 1-1-1H4a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm8 0a1 1 0 0 1-1-1h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm-4 5a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Z"/>
  </svg>
);

// --- UI Components --- //
const Loader: React.FC = () => (
  <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-3xl z-10 transition-opacity duration-300">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500" role="status">
      <span className="sr-only">Đang xử lý...</span>
    </div>
  </div>
);

const Header: React.FC = () => (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
        <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
          Trích Xuất Văn Bản
        </span>
      </h1>
      <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
        Tải lên một hình ảnh và để AI thông minh của chúng tôi chuyển đổi nó thành văn bản có thể chỉnh sửa ngay lập tức.
      </p>
    </header>
);

// --- Main App Component --- //
export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const imageUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : null, [imageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setExtractedText('');
      setError(null);
      setIsCopied(false);
    }
  };

  const handleExtractText = useCallback(async () => {
    if (!imageFile) {
      setError('Vui lòng chọn một hình ảnh trước.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const text = await extractTextFromImage(imageFile);
      setExtractedText(text);
    } catch (err: any) {
      console.error(err);
      setError('Không thể trích xuất văn bản. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setExtractedText('');
    setError(null);
    setIsCopied(false);
    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleCopyText = () => {
    if(extractedText) {
      navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <Header />
        
        <main className="space-y-8">
          {/* --- Image Uploader and Preview Card --- */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-6 transition-all duration-300">
            {!imageUrl ? (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-orange-400 border-dashed rounded-2xl cursor-pointer bg-orange-50/50 hover:bg-orange-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon />
                    <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-orange-600">Nhấn để tải lên</span> hoặc kéo thả</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            ) : (
              <div className="w-full space-y-6">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <img src={imageUrl} alt="Xem trước ảnh tải lên" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button onClick={handleExtractText} disabled={isLoading} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-red-500 to-orange-600 rounded-full shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                    <SparklesIcon />
                    {isLoading ? 'Đang trích xuất...' : 'Trích xuất văn bản'}
                  </button>
                  <button onClick={handleReset} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                     <TrashIcon />
                     Xóa ảnh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- Extracted Text Result Card --- */}
          {(isLoading || extractedText || error) && (
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-6 transition-all duration-300">
              {isLoading && <Loader />}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết quả</h2>
              {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">{error}</div>}
              
              <div className="bg-gray-100 rounded-2xl p-4 relative min-h-[200px] max-h-[50vh] overflow-y-auto w-full">
                 {extractedText && !isLoading ? (
                    <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans">
                        {extractedText}
                    </pre>
                 ) : (
                    <p className="text-gray-500">
                        {isLoading ? "" : "Văn bản được trích xuất sẽ xuất hiện ở đây..."}
                    </p>
                 )}
                {extractedText && !isLoading && (
                  <button
                    onClick={handleCopyText}
                    className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-orange-600 transition-all duration-200"
                    title="Sao chép văn bản"
                    aria-label="Sao chép văn bản"
                  >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}