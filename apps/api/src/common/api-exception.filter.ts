import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    this.report(host.switchToHttp().getRequest<Request>(), status, exception, raw);
    if (raw && typeof raw === 'object' && 'code' in raw) {
      response.status(status).json(raw);
      return;
    }
    const source =
      typeof raw === 'string'
        ? raw
        : raw && typeof raw === 'object' && 'message' in raw
          ? (raw as { message: string | string[] }).message
          : status >= 500
            ? '서버에서 요청을 처리하지 못했어요.'
            : '요청을 확인해 주세요.';
    const message = Array.isArray(source) ? source.join(' ') : source;
    response.status(status).json({
      statusCode: status,
      code:
        status === 400
          ? 'VALIDATION_ERROR'
          : status === 401
            ? 'UNAUTHORIZED'
            : status === 404
              ? 'NOT_FOUND'
              : status >= 500
                ? 'INTERNAL_ERROR'
                : 'REQUEST_FAILED',
      message,
    });
  }

  /**
   * Failures that point at a bug are logged; every other response stayed silent before, which
   * hid a client sending fields the API rejects. Only the method, the path without its query,
   * and the validation messages (property names, never values) are written.
   */
  private report(request: Request, status: number, exception: unknown, raw: unknown) {
    const where = `${request.method} ${request.path}`;
    if (status >= 500) {
      const reason = exception instanceof Error ? exception.stack || exception.message : exception;
      this.logger.error(`${status} ${where}`, String(reason));
      return;
    }
    if (status === 400 && !(raw && typeof raw === 'object' && 'code' in raw)) {
      const message =
        raw && typeof raw === 'object' && 'message' in raw
          ? (raw as { message: unknown }).message
          : raw;
      this.logger.warn(`400 ${where}: ${Array.isArray(message) ? message.join('; ') : message}`);
    }
  }
}
