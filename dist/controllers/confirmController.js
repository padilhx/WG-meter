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
const readingService_1 = require("../services/readingService");
const handlerError_1 = require("../utils/handlerError");
const confirmValidator_1 = require("../validators/confirmValidator");
/**
 * @param req
 * @param res
 */
function confirmController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationError = (0, confirmValidator_1.validateConfirmRequest)(req.body);
        if (validationError) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(validationError.error_code, validationError.error_description));
        }
        const { measure_uuid, confirmed_value } = req.body;
        try {
            const reading = yield (0, readingService_1.findReadingByUUID)(measure_uuid);
            if (!reading) {
                return res
                    .status(404)
                    .json((0, handlerError_1.handleError)('MEASURE_NOT_FOUND', 'Leitura não encontrada.'));
            }
            if (reading.has_confirmed) {
                return res
                    .status(409)
                    .json((0, handlerError_1.handleError)('CONFIRMATION_DUPLICATE', 'Leitura já confirmada.'));
            }
            yield (0, readingService_1.confirmReading)(measure_uuid, confirmed_value);
            return res.status(200).json({ success: true });
        }
        catch (error) {
            console.error('Erro ao confirmar leitura:', error);
            return res
                .status(500)
                .json((0, handlerError_1.handleError)('INTERNAL_ERROR', 'Erro interno do servidor.'));
        }
    });
}
