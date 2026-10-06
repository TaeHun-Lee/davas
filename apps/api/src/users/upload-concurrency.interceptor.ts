import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  type CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { finalize } from 'rxjs';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';

const MAX_CONCURRENT_UPLOADS_PER_TRACKER = 2;

@Injectable()
export class UploadConcurrencyInterceptor implements NestInterceptor {
  private readonly activeByTracker = new Map<string, number>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tracker = request.user?.id ?? request.ip ?? 'unknown';
    const active = this.activeByTracker.get(tracker) ?? 0;
    if (active >= MAX_CONCURRENT_UPLOADS_PER_TRACKER) {
      throw new HttpException(
        '동시에 처리할 수 있는 업로드 수를 초과했어요.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.activeByTracker.set(tracker, active + 1);
    const release = () => {
      const current = this.activeByTracker.get(tracker) ?? 1;
      if (current <= 1) {
        this.activeByTracker.delete(tracker);
      } else {
        this.activeByTracker.set(tracker, current - 1);
      }
    };

    try {
      return next.handle().pipe(finalize(release));
    } catch (error) {
      release();
      throw error;
    }
  }
}
