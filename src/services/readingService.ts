import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type MeasureType = 'WATER' | 'GAS';

/**
 * @param measureUUID
 * @returns
 */
export async function findReadingByUUID(measureUUID: string) {
  return prisma.reading.findUnique({ where: { measure_uuid: measureUUID } });
}

/**
 * @param measureUUID
 * @param confirmedValue
 * @returns
 */
export async function confirmReading(
  measureUUID: string,
  confirmedValue: number
) {
  const reading = await findReadingByUUID(measureUUID);

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
}

/**
 * @param customerCode
 * @param measureDatetime
 * @param measureType
 * @param measureValue
 * @param imageUrlOrBase64
 * @returns
 */
export async function saveReading(
  customerCode: string,
  measureDatetime: string,
  measureType: MeasureType,
  measureValue: string,
  imageUrlOrBase64: string
) {
  if (!['WATER', 'GAS'].includes(measureType)) {
    throw new Error('Tipo de medição inválido.');
  }

  const measureValueAsNumber = parseFloat(measureValue);
  if (isNaN(measureValueAsNumber) || measureValueAsNumber < 0) {
    throw new Error('O valor medido deve ser um número positivo.');
  }

  const isBase64 = imageUrlOrBase64.startsWith('data:image/');

  try {
    return await prisma.reading.create({
      data: {
        customer_code: customerCode,
        measure_datetime: new Date(measureDatetime),
        measure_type: measureType,
        measure_value: measureValue,
        image_url: isBase64 ? null : imageUrlOrBase64,
        image_data: isBase64 ? imageUrlOrBase64 : null,
        has_confirmed: false,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar leitura:', error);
    throw new Error('Erro ao salvar leitura.');
  }
}

/**
 * @param customerCode
 * @param measureType
 * @param measureDatetime
 * @returns
 */
export async function findReadingByCustomerAndMonth(
  customerCode: string,
  measureDatetime: string,
  measureType: MeasureType
) {
  const [startOfMonth, endOfMonth] = getMonthDateRange();

  try {
    return await prisma.reading.findFirst({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: { gte: startOfMonth, lte: endOfMonth },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar leitura:', error);
    throw new Error('Erro ao buscar leitura.');
  }
}

/**
 * @param customerCode
 * @param measureType
 * @returns
 */
export async function listReadingsByCustomer(
  customerCode: string,
  measureType?: MeasureType
) {
  const query: any = { customer_code: customerCode };

  if (measureType) {
    if (!['WATER', 'GAS'].includes(measureType)) {
      throw new Error('Tipo de medição inválido.');
    }
    query.measure_type = measureType;
  }

  try {
    return await prisma.reading.findMany({ where: query });
  } catch (error) {
    console.error('Erro ao listar leituras:', error);
    throw new Error('Erro ao listar leituras.');
  }
}

function getMonthDateRange(): [Date, Date] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [startOfMonth, endOfMonth];
}

/**
 * @param customerCode
 * @param measureType
 * @returns
 */
export async function findReadingsByCustomerAndType(
  customerCode: string,
  measureType?: MeasureType
) {
  if (measureType && !['WATER', 'GAS'].includes(measureType)) {
    throw new Error('Tipo de medição inválido.');
  }

  try {
    return await prisma.reading.findMany({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
      },
    });
  } catch (error) {
    console.error('Erro ao encontrar leituras:', error);
    throw new Error('Erro ao encontrar leituras.');
  }
}
