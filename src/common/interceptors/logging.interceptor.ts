// src/common/interceptors/logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

/**
 * LoggingInterceptor（全局日志拦截器）
 * - 记录每次 HTTP 请求的基本信息与耗时
 * - 便于快速定位慢请求/异常请求，生产可替换为结构化日志（如 pino/winston）
 *
 * 注意：
 * - 为简明起见，这里直接 console.log，生产环境应接入日志平台并加上 traceId
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = req;

    return next.handle().pipe(
      tap({
        next: () => {
          const cost = Date.now() - startedAt;
          // 这里不打印响应体，避免日志污染；生产可按需打点
          // 也可结合 res.statusCode 打印状态码
          // eslint-disable-next-line no-console
          console.log(`[HTTP] ${method} ${originalUrl} - ${cost}ms`);
        },
        error: () => {
          const cost = Date.now() - startedAt;
          // eslint-disable-next-line no-console
          console.error(`[HTTP] ${method} ${originalUrl} - failed in ${cost}ms`);
        },
      }),
    );
  }
}