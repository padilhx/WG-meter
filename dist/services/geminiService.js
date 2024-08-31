"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiReading = void 0;
const generative_ai_1 = require("@google/generative-ai");
const server_1 = require("@google/generative-ai/server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileManager = new server_1.GoogleAIFileManager(process.env.GEMINI_API_KEY || '');
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const getGeminiReading = (base64Image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica se a string base64 está no formato correto
        if (!base64Image || !base64Image.startsWith('data:image/')) {
            throw new Error('Imagem inválida ou não fornecida.');
        }
        const base64Data = base64Image.split(',')[1];
        if (!base64Data) {
            throw new Error('Dados da imagem não encontrados.');
        }
        // Salva a imagem temporariamente
        const tempFilePath = path_1.default.join(__dirname, 'temp', 'file.png');
        fs_1.default.mkdirSync(path_1.default.dirname(tempFilePath), { recursive: true });
        fs_1.default.writeFileSync(tempFilePath, base64Data, 'base64');
        // Faz o upload do arquivo
        const uploadResponse = yield fileManager.uploadFile(tempFilePath, {
            mimeType: 'image/png',
            displayName: 'Smart Meter Image',
        });
        // Processa a imagem com o modelo
        const result = yield model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: 'valor da fatura' },
        ]);
        // Remove o arquivo temporário
        fs_1.default.unlinkSync(tempFilePath);
        return {
            imageUrl: uploadResponse.file.uri,
            measureValue: result.response.text(),
        };
    }
    catch (error) {
        console.error('Error when calling API Gemini:', error);
        throw new Error('Error getting reading');
    }
});
exports.getGeminiReading = getGeminiReading;
