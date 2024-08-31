import { Request, Response } from 'express';
import { validateListRequest } from '../validators/allValidators';
import { findReadingsByCustomerAndType } from '../services/readingService';
import { handleError, ERROR_CODES } from '../utils/handlerError';

import { MeasureType } from '../services/readingService';

export async function listController(req: Request, res: Response) {
  const { customer_code } = req.params;
  const measure_type = req.query.measure_type as string | undefined;

  const validationError = validateListRequest(customer_code, measure_type);
  if (validationError) {
    return res
      .status(400)
      .json(
        handleError(ERROR_CODES.INVALID_DATA, validationError.error_description)
      );
  }

  const validatedMeasureType: MeasureType | undefined =
    measure_type && ['WATER', 'GAS'].includes(measure_type)
      ? (measure_type as MeasureType)
      : undefined;

  if (!validatedMeasureType) {
    return res
      .status(400)
      .json(handleError(ERROR_CODES.INVALID_DATA, 'Tipo de medição inválido.'));
  }

  try {
    const measures = await findReadingsByCustomerAndType(
      customer_code,
      validatedMeasureType
    );

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: ERROR_CODES.MEASURE_NOT_FOUND,
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
  } catch (error) {
    console.error('Erro ao listar leituras:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor.';
    res.status(500).json({
      error_code: ERROR_CODES.INTERNAL_ERROR,
      error_description: errorMessage,
    });
  }
}

// Função para upload e processamento de imagem
