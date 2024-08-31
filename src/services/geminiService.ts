import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const getGeminiReading = async (base64Image: string) => {
  try {
    if (!base64Image || !base64Image.startsWith('data:image/')) {
      throw new Error('Imagem inválida ou não fornecida.');
    }

    const base64Data = base64Image.split(',')[1];
    if (!base64Data) {
      throw new Error('Dados da imagem não encontrados.');
    }

    const tempFilePath = path.join(__dirname, 'temp', 'file.png');
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
    fs.writeFileSync(tempFilePath, base64Data, 'base64');

    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: 'image/png',
      displayName: 'Smart Meter Image',
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: 'valor da fatura' },
    ]);

    fs.unlinkSync(tempFilePath);

    return {
      imageUrl: uploadResponse.file.uri,
      measureValue: result.response.text(),
    };
  } catch (error) {
    console.error('Error when calling API Gemini:', error);
    throw new Error('Error getting reading');
  }
};
