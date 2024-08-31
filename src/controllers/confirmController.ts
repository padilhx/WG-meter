import { Request, Response } from 'express';
import { validateConfirmRequest } from '../validators/allValidators';
import { confirmReading } from '../services/readingService';
import { handleError, ERROR_CODES } from '../utils/handlerError';

export async function confirmController(req: Request, res: Response) {
  const validationError = validateConfirmRequest(req.body);

  if (validationError) {
    return res
      .status(400)
      .json(
        handleError(ERROR_CODES.INVALID_DATA, validationError.error_description)
      );
  }

  const { measure_uuid, confirmed_value } = req.body;

  try {
    const updatedReading = await confirmReading(measure_uuid, confirmed_value);

    if (!updatedReading) {
      return res
        .status(404)
        .json(
          handleError(ERROR_CODES.MEASURE_NOT_FOUND, 'Leitura não encontrada.')
        );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao confirmar leitura:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor.';
    res.status(500).json(handleError(ERROR_CODES.INTERNAL_ERROR, errorMessage));
  }
}
