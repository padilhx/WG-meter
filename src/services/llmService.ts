import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function processImageWithLLM(
  imageBase64: string
): Promise<number> {
  try {
    console.log('Base64 Image (truncated):', imageBase64.substring(0, 100));

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Image content in base64: ${imageBase64}`,
            },
          ],
        },
      ],
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', response.data);

    const result = response.data.candidates[0]?.content?.parts[0]?.text;

    if (!result) {
      throw new Error('A resposta da API não contém o texto esperado.');
    }

    const measureValue = extractMeasureValue(result);
    return measureValue;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Erro ao processar a imagem com a API LLM:',
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error('Erro ao processar a imagem com a API LLM:', error.message);
    } else {
      console.error(
        'Erro desconhecido ao processar a imagem com a API LLM:',
        error
      );
    }
    throw new Error('Erro ao processar a imagem com a API LLM.');
  }
}

function extractMeasureValue(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
