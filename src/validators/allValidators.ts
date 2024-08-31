import { ERROR_CODES } from '../utils/handlerError';

interface ConfirmRequestBody {
  measure_uuid: string;
  confirmed_value: number;
}

export function validateConfirmRequest(body: ConfirmRequestBody) {
  const { measure_uuid, confirmed_value } = body;

  if (!measure_uuid || typeof measure_uuid !== 'string') {
    return {
      error_code: ERROR_CODES.INVALID_DATA,
      error_description:
        'UUID de medição inválido. O campo measure_uuid é obrigatório e deve ser uma string.',
    };
  }

  if (typeof confirmed_value !== 'number' || isNaN(confirmed_value)) {
    return {
      error_code: ERROR_CODES.INVALID_DATA,
      error_description:
        'Valor confirmado inválido. O campo confirmed_value é obrigatório e deve ser um número válido.',
    };
  }

  return null;
}

export function validateListRequest(
  customer_code: string,
  measure_type?: string
): { error_code: string; error_description: string } | null {
  if (!customer_code || typeof customer_code !== 'string') {
    return {
      error_code: 'INVALID_DATA',
      error_description: 'Código de cliente inválido.',
    };
  }

  if (measure_type && !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
    return {
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitido. Use "WATER" ou "GAS".',
    };
  }

  return null;
}

interface UploadRequestBody {
  base64Image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

export function validateUploadRequest(body: UploadRequestBody) {
  const imageError = validateImage(body.base64Image);
  if (imageError) return imageError;

  const customerCodeError = validateCustomerCode(body.customer_code);
  if (customerCodeError) return customerCodeError;

  const measureDatetimeError = validateMeasureDatetime(body.measure_datetime);
  if (measureDatetimeError) return measureDatetimeError;

  const measureTypeError = validateMeasureType(body.measure_type);
  if (measureTypeError) return measureTypeError;

  return null;
}

function validateImage(
  image: string
): { error_code: string; error_description: string } | null {
  const base64Pattern =
    /^data:image\/(png|jpg|jpeg|gif|webp);base64,[a-zA-Z0-9+/=]+$/;

  const urlPattern = /^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))$/;

  const isBase64Image = base64Pattern.test(image);
  const isUrlImage = urlPattern.test(image);

  return isBase64Image || isUrlImage
    ? null
    : {
        error_code: 'INVALID_DATA',
        error_description:
          'Imagem inválida ou não fornecida. Deve ser uma URL válida ou Base64.',
      };
}
function validateCustomerCode(
  customerCode: string
): { error_code: string; error_description: string } | null {
  return typeof customerCode === 'string' && customerCode.trim() !== ''
    ? null
    : createError('INVALID_DATA', 'Código de cliente inválido.');
}

function validateMeasureDatetime(
  measureDatetime: string
): { error_code: string; error_description: string } | null {
  return typeof measureDatetime === 'string' &&
    !isNaN(Date.parse(measureDatetime))
    ? null
    : createError('INVALID_DATA', 'Data e hora de medição inválidas.');
}

function validateMeasureType(
  measureType: string
): { error_code: string; error_description: string } | null {
  const validTypes = ['WATER', 'GAS'];
  return typeof measureType === 'string' &&
    validTypes.includes(measureType.toUpperCase())
    ? null
    : createError(
        'INVALID_DATA',
        'Tipo de medição inválido. Deve ser "WATER" ou "GAS".'
      );
}

function createError(errorCode: string, errorDescription: string) {
  return { error_code: errorCode, error_description: errorDescription };
}
