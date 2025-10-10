// src/common/interceptors/transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * TransformInterceptor（统一成功响应包装）
 * - 将 controller 返回的数据统一包装为 { success, data, timestamp }
 * - 当前“仅提供实现，不默认启用”，避免改变既有 e2e 断言（如根路由与 /health）
 * - 如需启用：在 main.ts 中 useGlobalInterceptors(new TransformInterceptor())
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}