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
exports.confirmController = confirmController;
exports.listController = listController;
exports.uploadController = uploadController;
const allValidators_1 = require("../validators/allValidators");
const readingService_1 = require("../services/readingService");
const handlerError_1 = require("../utils/handlerError");
const geminiService_1 = require("../services/geminiService");
const llmService_1 = require("../services/llmService");
// Função para confirmar uma leitura
function confirmController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = (0, allValidators_1.validateConfirmRequest)(req.body);
        if (validationError) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, validationError.error_description));
        }
        const { measure_uuid, confirmed_value } = req.body;
        try {
            const updatedReading = yield (0, readingService_1.confirmReading)(measure_uuid, confirmed_value);
            if (!updatedReading) {
                return res
                    .status(404)
                    .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.MEASURE_NOT_FOUND, 'Leitura não encontrada.'));
            }
            res.status(200).json({ success: true });
        }
        catch (error) {
            console.error('Erro ao confirmar leitura:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor.';
            res.status(500).json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INTERNAL_ERROR, errorMessage));
        }
    });
}
// Função para listar leituras
function listController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { customer_code } = req.params;
        const measure_type = req.query.measure_type;
        const validationError = (0, allValidators_1.validateListRequest)(customer_code, measure_type);
        if (validationError) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, validationError.error_description));
        }
        const validatedMeasureType = measure_type && ['WATER', 'GAS'].includes(measure_type)
            ? measure_type
            : undefined;
        if (!validatedMeasureType) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, 'Tipo de medição inválido.'));
        }
        try {
            const measures = yield (0, readingService_1.findReadingsByCustomerAndType)(customer_code, validatedMeasureType);
            if (measures.length === 0) {
                return res.status(404).json({
                    error_code: handlerError_1.ERROR_CODES.MEASURE_NOT_FOUND,
                    error_description: 'Nenhuma leitura encontrada.',
                });
            }
            res.status(200).json({
                customer_code,
                measures: measures.map((measure) => ({
                    measure_uuid: measure.measure_uuid,
                    measure_datetime: measure.measure_datetime.toISOString(),
                    measure_type: measure.measure_type,
                    has_confirmed: measure.has_confirmed,
                    image_url: measure.image_url,
                })),
            });
        }
        catch (error) {
            console.error('Erro ao listar leituras:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor.';
            res.status(500).json({
                error_code: handlerError_1.ERROR_CODES.INTERNAL_ERROR,
                error_description: errorMessage,
            });
        }
    });
}
// Função para upload e processamento de imagem
function uploadController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = (0, allValidators_1.validateUploadRequest)(req.body);
        if (validationError) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, validationError.error_description));
        }
        const { base64Image, customer_code, measure_datetime, measure_type } = req.body;
        console.log(req.body);
        if (!base64Image || !base64Image.startsWith('data:image/')) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, 'Imagem inválida ou não for.'));
        }
        const validatedMeasureType = measure_type && ['WATER', 'GAS'].includes(measure_type)
            ? measure_type
            : undefined;
        if (!validatedMeasureType) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_DATA, 'Tipo de medição inválido.'));
        }
        try {
            const existingReading = yield (0, readingService_1.findReadingByCustomerAndMonth)(customer_code, measure_datetime, validatedMeasureType);
            if (existingReading) {
                return res
                    .status(409)
                    .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.DOUBLE_REPORT, 'Leitura do mês já realizada.'));
            }
            const measureValue = yield (0, llmService_1.processImageWithLLM)(base64Image);
            const { imageUrl } = yield (0, geminiService_1.getGeminiReading)(base64Image);
            // Aqui, se a função saveReading espera strings e não números:
            const measureValueString = measureValue.toString();
            const newReading = yield (0, readingService_1.saveReading)(customer_code, measure_datetime, validatedMeasureType, measureValueString, // Convertido para string
            imageUrl // Adicione o URL da imagem se necessário
            );
            res.status(200).json({
                image_url: imageUrl,
                measure_value: measureValueString, // Convertido para string
                measure_uuid: newReading.measure_uuid,
            });
        }
        catch (error) {
            console.error('Erro ao processar a imagem ou salvar a leitura:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor.';
            res.status(500).json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INTERNAL_ERROR, errorMessage));
        }
    });
}
