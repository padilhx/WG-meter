"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.errorHandler = void 0;
exports.handleError = handleError;
/**
 * @param errorCode
 * @param errorDescription
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
function handleError(errorCode, errorDescription) {
    return {
        error_code: errorCode,
        error_description: errorDescription,
    };
}
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Erro interno do servidor.',
    });
};
exports.errorHandler = errorHandler;
exports.ERROR_CODES = {
    INVALID_DATA: 'INVALID_DATA',
    DOUBLE_REPORT: 'DOUBLE_REPORT',
    MEASURE_NOT_FOUND: 'MEASURE_NOT_FOUND',
    CONFIRMATION_DUPLICATE: 'CONFIRMATION_DUPLICATE',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    INVALID_TYPE: 'INVALID_TYPE',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    UNAUTHORIZED: 'UNAUTHORIZED',
};
