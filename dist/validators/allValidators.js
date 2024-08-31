"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfirmRequest = validateConfirmRequest;
exports.validateListRequest = validateListRequest;
exports.validateUploadRequest = validateUploadRequest;
const handlerError_1 = require("../utils/handlerError");
// Função para validar a solicitação de confirmação
function validateConfirmRequest(body) {
    const { measure_uuid, confirmed_value } = body;
    if (!measure_uuid || typeof measure_uuid !== 'string') {
        return {
            error_code: handlerError_1.ERROR_CODES.INVALID_DATA,
            error_description: 'UUID de medição inválido. O campo measure_uuid é obrigatório e deve ser uma string.',
        };
    }
    if (typeof confirmed_value !== 'number' || isNaN(confirmed_value)) {
        return {
            error_code: handlerError_1.ERROR_CODES.INVALID_DATA,
            error_description: 'Valor confirmado inválido. O campo confirmed_value é obrigatório e deve ser um número válido.',
        };
    }
    return null;
}
// Função para validar a solicitação de listagem
function validateListRequest(customer_code, measure_type) {
    if (!customer_code || typeof customer_code !== 'string') {
        return {
            error_code: 'INVALID_DATA',
            error_description: 'Código de cliente inválido.',
        };
    }
    if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
        return {
            error_code: 'INVALID_TYPE',
            error_description: 'Tipo de medição não permitido. Use "WATER" ou "GAS".',
        };
    }
    return null;
}
function validateUploadRequest(body) {
    const imageError = validateImage(body.base64Image);
    if (imageError)
        return imageError;
    const customerCodeError = validateCustomerCode(body.customer_code);
    if (customerCodeError)
        return customerCodeError;
    const measureDatetimeError = validateMeasureDatetime(body.measure_datetime);
    if (measureDatetimeError)
        return measureDatetimeError;
    const measureTypeError = validateMeasureType(body.measure_type);
    if (measureTypeError)
        return measureTypeError;
    return null;
}
// Função para validar a imagem
function validateImage(image) {
    const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,[a-zA-Z0-9+/=]+$/;
    const urlPattern = /^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))$/;
    const isBase64Image = base64Pattern.test(image);
    const isUrlImage = urlPattern.test(image);
    return isBase64Image || isUrlImage
        ? null
        : {
            error_code: 'INVALID_DATA',
            error_description: 'Imagem inválida ou não fornecida. Deve ser uma URL válida ou Base64.',
        };
}
function validateCustomerCode(customerCode) {
    return typeof customerCode === 'string' && customerCode.trim() !== ''
        ? null
        : createError('INVALID_DATA', 'Código de cliente inválido.');
}
// Função para validar a data e hora da medição
function validateMeasureDatetime(measureDatetime) {
    return typeof measureDatetime === 'string' &&
        !isNaN(Date.parse(measureDatetime))
        ? null
        : createError('INVALID_DATA', 'Data e hora de medição inválidas.');
}
// Função para validar o tipo de medição
function validateMeasureType(measureType) {
    const validTypes = ['WATER', 'GAS'];
    return typeof measureType === 'string' &&
        validTypes.includes(measureType.toUpperCase())
        ? null
        : createError('INVALID_DATA', 'Tipo de medição inválido. Deve ser "WATER" ou "GAS".');
}
// Função para criar um erro
function createError(errorCode, errorDescription) {
    return { error_code: errorCode, error_description: errorDescription };
}
