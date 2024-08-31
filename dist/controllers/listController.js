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
exports.listController = listController;
const handlerError_1 = require("../utils/handlerError");
const readingService_1 = require("../services/readingService");
/**
 * @param req
 * @param res
 */
function listController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`chegou`);
        const { customer_code } = req.params;
        const measure_type = req.query.measure_type;
        if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
            return res
                .status(400)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INVALID_TYPE, 'Tipo de medição não permitido. Use "WATER" ou "GAS".'));
        }
        try {
            const measures = yield (0, readingService_1.findReadingsByCustomerAndType)(customer_code, measure_type);
            if (measures.length === 0) {
                return res
                    .status(404)
                    .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.MEASURE_NOT_FOUND, 'Nenhuma leitura encontrada para o cliente especificado.'));
            }
            return res.status(200).json({
                customer_code,
                measures,
            });
        }
        catch (error) {
            console.error('Erro ao listar leituras:', error);
            return res
                .status(500)
                .json((0, handlerError_1.handleError)(handlerError_1.ERROR_CODES.INTERNAL_ERROR, 'Erro interno do servidor.'));
        }
    });
}
