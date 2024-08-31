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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = uploadController;
const uploadValidator_1 = require("../validators/uploadValidator");
const handlerError_1 = require("../utils/handlerError");
const readingService_1 = require("../services/readingService");
const llmService_1 = require("../services/llmService"); // Importe o serviço
/**
 * Função para processar a imagem.
 * @param imageBase64 - Imagem em base64.
 */
function processImage(imageBase64) {
    console.log('Processando imagem:', imageBase64);
    // Adicione lógica adicional para processar a imagem base64 se necessário
}
/**
 * Controlador para o endpoint de upload.
 * @param req - Requisição Express.
 * @param res - Resposta Express.
 */
function uploadController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validação dos dados da requisição
        const validationError = (0, uploadValidator_1.validateUploadRequest)(req.body);
        if (validationError) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(validationError.error_code, validationError.error_description));
        }
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        const imageBase64 = image;
        if (imageBase64) {
            // Processar a imagem (opcional, pode ser removido se não for necessário)
            processImage(imageBase64);
            try {
                // Processar a imagem com a API LLM para obter o valor da medição
                const measureValue = yield (0, llmService_1.processImageWithLLM)(imageBase64);
                // Verificar se já existe uma leitura para o cliente e tipo de medição no mês atual
                const existingReading = yield (0, readingService_1.findReadingByCustomerAndMonth)(customer_code, measure_type);
                if (existingReading) {
                    return res.status(409).json({
                        error_code: 'DOUBLE_REPORT',
                        error_description: 'Leitura do mês já realizada.',
                    });
                }
                // Salvar a nova leitura no banco de dados
                const newReading = yield (0, readingService_1.saveReading)(customer_code, measure_datetime, measure_type, measureValue, 'temp_image_url');
                // Retornar a resposta com os dados da leitura
                res.status(200).json({
                    image_url: 'temp_image_url',
                    measure_value: measureValue,
                    measure_uuid: newReading.measure_uuid,
                });
            }
            catch (error) {
                console.error('Erro ao processar a imagem ou salvar a leitura:', error);
                res.status(500).json({
                    error_code: 'INTERNAL_ERROR',
                    error_description: 'Erro interno do servidor.',
                });
            }
        }
        else {
            res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Imagem inválida ou não fornecida.',
            });
        }
    });
}
