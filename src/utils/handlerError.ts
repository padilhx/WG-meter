import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  error_code: string;
  error_description: string;
}

/**
 * @param errorCode
 * @param errorDescription
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function handleError(
  errorCode: string,
  errorDescription: string
): ErrorResponse {
  return {
    error_code: errorCode,
    error_description: errorDescription,
  };
}
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  res.status(500).json({
    error_code: 'INTERNAL_ERROR',
    error_description: 'Erro interno do servidor.',
  });
};

export const ERROR_CODES = {
  INVALID_DATA: 'INVALID_DATA',
  DOUBLE_REPORT: 'DOUBLE_REPORT',
  MEASURE_NOT_FOUND: 'MEASURE_NOT_FOUND',
  CONFIRMATION_DUPLICATE: 'CONFIRMATION_DUPLICATE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_TYPE: 'INVALID_TYPE',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
};
