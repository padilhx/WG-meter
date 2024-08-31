"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfirmRequest = validateConfirmRequest;
const handlerError_1 = require("../utils/handlerError");
/**
 * @param body
 * @returns
 */
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
