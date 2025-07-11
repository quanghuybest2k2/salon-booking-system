import { Response } from 'express';

interface IResponseSuccess<T> {
  status: boolean;
  message: string;
  errors: null;
  data: T;
}

interface IResponseError<E = unknown> {
  status: boolean;
  message: string;
  errors: E;
  data: null;
}

export class ResponseHandler {
  /**
   * Generate success response.
   *
   * @param res Express Response object
   * @param data Response data object
   * @param message Optional success message
   * @param statusCode HTTP status code, default is 200
   * @returns Json response
   */
  public static responseSuccess<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = 200,
  ): Response {
    const response: IResponseSuccess<T> = {
      status: true,
      message,
      errors: null,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Generate error response.
   *
   * @param res Express Response object
   * @param errors Errors object or array
   * @param message Optional error message
   * @param statusCode HTTP status code, default is 400
   * @returns Json response
   */
  public static responseError(
    res: Response,
    errors: unknown,
    message: string = 'An error occurred',
    statusCode: number = 400,
  ): Response {
    const response: IResponseError = {
      status: false,
      message,
      errors,
      data: null,
    };
    return res.status(statusCode).json(response);
  }
}
