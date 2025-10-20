/// <reference types="vite/client" />

import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Google Generative AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || (import.meta.env.GEMINI_API_KEY as string) || 'YOUR_API_KEY');

// Hàm chuyển đổi File thành base64
const fileToGenerativePart = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Lấy phần base64 từ data URL
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Hàm trích xuất văn bản từ hình ảnh
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    // Kiểm tra API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      throw new Error('Vui lòng thiết lập VITE_GEMINI_API_KEY trong file .env');
    }

    // Chuyển đổi file thành base64
    const base64Image = await fileToGenerativePart(imageFile);

    // Khởi tạo model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Tạo prompt để trích xuất văn bản
    const prompt = `Hãy trích xuất toàn bộ văn bản có trong hình ảnh này một cách chính xác nhất có thể.
    Chỉ trả về văn bản được trích xuất, không thêm bất kỳ giải thích hoặc bình luận nào khác.
    Nếu không tìm thấy văn bản nào, hãy trả về chuỗi rỗng.`;

    // Tạo request với hình ảnh và prompt
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type,
      },
    };

    // Gọi API với prompt và hình ảnh
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Lỗi khi trích xuất văn bản:', error);

    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại.');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến API. Vui lòng kiểm tra kết nối mạng.');
      }
      throw new Error(`Lỗi xử lý: ${error.message}`);
    }

    throw new Error('Có lỗi không xác định xảy ra khi trích xuất văn bản.');
  }
};