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
exports.confirmReadingController = confirmReadingController;
exports.listReadingsController = listReadingsController;
exports.uploadController = uploadController;
const yourValidators_1 = require("../validators/yourValidators");
const readingService_1 = require("../services/readingService");
const llmService_1 = require("../services/llmService");
function confirmReadingController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = (0, yourValidators_1.validateConfirmRequest)(req.body);
        if (validationError) {
            return res.status(400).json(validationError);
        }
        const { measure_uuid, confirmed_value } = req.body;
        try {
            const updatedReading = yield (0, readingService_1.confirmReading)(measure_uuid, confirmed_value);
            if (!updatedReading) {
                return res.status(404).json({
                    error_code: 'READING_NOT_FOUND',
                    error_description: 'Leitura não encontrada.',
                });
            }
            res.status(200).json(updatedReading);
        }
        catch (error) {
            console.error('Erro ao confirmar leitura:', error);
            res.status(500).json({
                error_code: 'INTERNAL_ERROR',
                error_description: 'Erro interno do servidor.',
            });
        }
    });
}
function listReadingsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { customer_code } = req.params;
        const measure_type = req.query.measure_type;
        const validationError = (0, yourValidators_1.validateListRequest)(customer_code, measure_type);
        if (validationError) {
            return res.status(400).json(validationError);
        }
        try {
            const measures = yield (0, readingService_1.findReadingsByCustomerAndType)(customer_code, measure_type);
            if (measures.length === 0) {
                return res.status(404).json({
                    error_code: 'MEASURE_NOT_FOUND',
                    error_description: 'Nenhuma leitura encontrada para o cliente especificado.',
                });
            }
            res.status(200).json({
                customer_code,
                measures,
            });
        }
        catch (error) {
            console.error('Erro ao listar leituras:', error);
            res.status(500).json({
                error_code: 'INTERNAL_ERROR',
                error_description: 'Erro interno do servidor.',
            });
        }
    });
}
function uploadController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = (0, yourValidators_1.validateUploadRequest)(req.body);
        if (validationError) {
            return res.status(400).json(validationError);
        }
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        try {
            const existingReading = yield (0, readingService_1.findReadingByCustomerAndMonth)(customer_code, measure_type);
            if (existingReading) {
                return res.status(409).json({
                    error_code: 'DOUBLE_REPORT',
                    error_description: 'Leitura do mês já realizada.',
                });
            }
            const measureValue = yield (0, llmService_1.processImageWithLLM)(image);
            const newReading = yield (0, readingService_1.saveReading)(customer_code, measure_datetime, measure_type, measureValue, 'temp_image_url');
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
    });
}
