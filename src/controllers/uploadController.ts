import { Request, Response } from 'express';
import { validateUploadRequest } from '../validators/allValidators';
import {
  saveReading,
  findReadingByCustomerAndMonth,
} from '../services/readingService';
import { handleError, ERROR_CODES } from '../utils/handlerError';
import { getGeminiReading } from '../services/geminiService';

import { MeasureType } from '../services/readingService';
import { processImageWithLLM } from '../services/llmService';

export async function uploadController(req: Request, res: Response) {
  const validationError = validateUploadRequest(req.body);

  if (validationError) {
    return res
      .status(400)
      .json(
        handleError(ERROR_CODES.INVALID_DATA, validationError.error_description)
      );
  }

  const { base64Image, customer_code, measure_datetime, measure_type } =
    req.body;
  console.log(req.body);
  if (!base64Image || !base64Image.startsWith('data:image/')) {
    return res
      .status(400)
      .json(
        handleError(ERROR_CODES.INVALID_DATA, 'Imagem inválida ou não for.')
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
    const existingReading = await findReadingByCustomerAndMonth(
      customer_code,
      measure_datetime,
      validatedMeasureType
    );

    if (existingReading) {
      return res
        .status(409)
        .json(
          handleError(ERROR_CODES.DOUBLE_REPORT, 'Leitura do mês já realizada.')
        );
    }

    const measureValue = await processImageWithLLM(base64Image);
    const { imageUrl } = await getGeminiReading(base64Image);

    const measureValueString = measureValue.toString();

    const newReading = await saveReading(
      customer_code,
      measure_datetime,
      validatedMeasureType,
      measureValueString,
      imageUrl
    );

    res.status(200).json({
      image_url: imageUrl,
      measure_value: measureValueString,
      measure_uuid: newReading.measure_uuid,
    });
  } catch (error) {
    console.error('Erro ao processar a imagem ou salvar a leitura:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor.';
    res.status(500).json(handleError(ERROR_CODES.INTERNAL_ERROR, errorMessage));
  }
}
