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
exports.processImageWithLLM = processImageWithLLM;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
function processImageWithLLM(imageBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
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
            const response = yield axios_1.default.post(`${API_URL}?key=${API_KEY}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('API Response:', response.data);
            const result = (_c = (_b = (_a = response.data.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text;
            if (!result) {
                throw new Error('A resposta da API não contém o texto esperado.');
            }
            const measureValue = extractMeasureValue(result);
            return measureValue;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Erro ao processar a imagem com a API LLM:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
            }
            else if (error instanceof Error) {
                console.error('Erro ao processar a imagem com a API LLM:', error.message);
            }
            else {
                console.error('Erro desconhecido ao processar a imagem com a API LLM:', error);
            }
            throw new Error('Erro ao processar a imagem com a API LLM.');
        }
    });
}
function extractMeasureValue(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}
