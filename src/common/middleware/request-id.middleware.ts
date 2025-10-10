// src/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * RequestIdMiddleware
 * - 为每个进入的请求注入 traceId（请求链路 ID）
 * - 读取优先级：客户端传入的 x-trace-id > 服务端新生成的 UUID
 * - 作用：
 *   1) 便于跨日志、跨服务定位一次请求（排障关键）
 *   2) 我们的全局异常过滤器会把 traceId 写入错误响应，前后端可凭此对齐
 *
 * 可选行为：
 * - 也可将 traceId 写入响应头，便于前端直接读取
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 尝试从请求头读取现有 traceId
    const incoming = (req.headers['x-trace-id'] as string) || undefined;
    const traceId = incoming || randomUUID();

    // 将 traceId 绑定到请求对象，便于后续拦截器/过滤器读取
    (req as any).traceId = traceId;

    // 将 traceId 反写到响应头，便于前端/调用方获取
    res.setHeader('x-trace-id', traceId);

    next();
  }
}