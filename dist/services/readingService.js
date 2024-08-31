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
exports.findReadingByUUID = findReadingByUUID;
exports.confirmReading = confirmReading;
exports.saveReading = saveReading;
exports.findReadingByCustomerAndMonth = findReadingByCustomerAndMonth;
exports.listReadingsByCustomer = listReadingsByCustomer;
exports.findReadingsByCustomerAndType = findReadingsByCustomerAndType;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Encontra uma leitura pelo UUID
 * @param measureUUID UUID da leitura
 * @returns A leitura encontrada ou null
 */
function findReadingByUUID(measureUUID) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.reading.findUnique({ where: { measure_uuid: measureUUID } });
    });
}
/**
 * Confirma o valor da leitura
 * @param measureUUID UUID da leitura
 * @param confirmedValue Valor confirmado
 * @returns A leitura atualizada
 */
function confirmReading(measureUUID, confirmedValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const reading = yield findReadingByUUID(measureUUID);
        if (!reading) {
            throw new Error('Leitura não encontrada.');
        }
        if (reading.has_confirmed) {
            throw new Error('Leitura já confirmada.');
        }
        return prisma.reading.update({
            where: { measure_uuid: measureUUID },
            data: { confirmed_value: confirmedValue, has_confirmed: true },
        });
    });
}
/**
 * Salva uma nova leitura
 * @param customerCode Código do cliente
 * @param measureDatetime Data e hora da medição
 * @param measureType Tipo da medição
 * @param measureValue Valor medido
 * @param imageUrlOrBase64 URL da imagem ou dados da imagem em Base64
 * @returns A leitura salva
 */
function saveReading(customerCode, measureDatetime, measureType, measureValue, imageUrlOrBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!['WATER', 'GAS'].includes(measureType)) {
            throw new Error('Tipo de medição inválido.');
        }
        const measureValueAsNumber = parseFloat(measureValue);
        if (isNaN(measureValueAsNumber) || measureValueAsNumber < 0) {
            throw new Error('O valor medido deve ser um número positivo.');
        }
        // Verifica se a string é um Base64 válido de uma imagem
        const isBase64 = imageUrlOrBase64.startsWith('data:image/');
        try {
            return yield prisma.reading.create({
                data: {
                    customer_code: customerCode,
                    measure_datetime: new Date(measureDatetime),
                    measure_type: measureType,
                    measure_value: measureValue,
                    image_url: isBase64 ? null : imageUrlOrBase64, // Armazena URL ou null se for Base64
                    image_data: isBase64 ? imageUrlOrBase64 : null, // Armazena Base64 ou null se for URL
                    has_confirmed: false,
                },
            });
        }
        catch (error) {
            console.error('Erro ao salvar leitura:', error);
            throw new Error('Erro ao salvar leitura.');
        }
    });
}
/**
 * Encontra uma leitura pelo código do cliente e mês
 * @param customerCode Código do cliente
 * @param measureType Tipo da medição
 * @param measureDatetime Data e hora da medição
 * @returns A leitura encontrada ou null
 */
function findReadingByCustomerAndMonth(customerCode, measureDatetime, measureType) {
    return __awaiter(this, void 0, void 0, function* () {
        const [startOfMonth, endOfMonth] = getMonthDateRange();
        try {
            return yield prisma.reading.findFirst({
                where: {
                    customer_code: customerCode,
                    measure_type: measureType,
                    measure_datetime: { gte: startOfMonth, lte: endOfMonth },
                },
            });
        }
        catch (error) {
            console.error('Erro ao buscar leitura:', error);
            throw new Error('Erro ao buscar leitura.');
        }
    });
}
/**
 * Lista as leituras de um cliente
 * @param customerCode Código do cliente
 * @param measureType Tipo da medição (opcional)
 * @returns Leituras encontradas
 */
function listReadingsByCustomer(customerCode, measureType) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = { customer_code: customerCode };
        if (measureType) {
            if (!['WATER', 'GAS'].includes(measureType)) {
                throw new Error('Tipo de medição inválido.');
            }
            query.measure_type = measureType;
        }
        try {
            return yield prisma.reading.findMany({ where: query });
        }
        catch (error) {
            console.error('Erro ao listar leituras:', error);
            throw new Error('Erro ao listar leituras.');
        }
    });
}
/**
 * Obtém o intervalo de datas do mês atual
 * @returns [Início do mês, Fim do mês]
 */
function getMonthDateRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return [startOfMonth, endOfMonth];
}
/**
 * Encontra leituras pelo código do cliente e tipo de medição
 * @param customerCode Código do cliente
 * @param measureType Tipo da medição (opcional)
 * @returns Leituras encontradas
 */
function findReadingsByCustomerAndType(customerCode, measureType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (measureType && !['WATER', 'GAS'].includes(measureType)) {
            throw new Error('Tipo de medição inválido.');
        }
        try {
            return yield prisma.reading.findMany({
                where: {
                    customer_code: customerCode,
                    measure_type: measureType,
                },
            });
        }
        catch (error) {
            console.error('Erro ao encontrar leituras:', error);
            throw new Error('Erro ao encontrar leituras.');
        }
    });
}
