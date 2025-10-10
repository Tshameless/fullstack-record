// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';

/**
 * HttpExceptionFilter（全局异常过滤器）
 * - 统一框架内抛出的 HttpException 以及未知异常的响应格式
 * - 好处：
 *   1) 前端可稳定依赖统一错误结构，便于全局处理（如 toast、重试、上报）
 *   2) 便于排查问题：附带时间戳、请求路径、可选 traceId
 * - 典型使用：
 *   app.useGlobalFilters(new HttpExceptionFilter())
 */
@Catch() // 不仅捕获 HttpException，也兜底捕获未知异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // 1) 识别异常类型与状态码：业务主动抛的 HttpException 与未知异常区分
    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2) 统一提取 message：兼容 string 与 { message: string | string[] } 等结构
    let message: string | string[] = 'Internal Server Error';
    let details: unknown = undefined;

    if (isHttp) {
      const resp = (exception as HttpException).getResponse();
      if (typeof resp === 'string') {
        message = resp;
      } else if (typeof resp === 'object' && resp) {
        const body: any = resp;
        // 常见的 ValidationPipe 错误结构包含 message: string[]
        message = body.message ?? body.error ?? 'Http Error';
        details = body.details ?? body; // 保留更多上下文，方便排查
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      // 生产环境可隐藏 details，开发环境可透出（建议配合 NODE_ENV 控制）
      details = process.env.NODE_ENV === 'development' ? exception.stack : undefined;
    }

    // 3) 统一错误响应结构
    const payload = {
      code: status, // 和 HTTP 状态码一致
      message,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      // 可接入日志/链路：如从 header 或 request 上注入/读取 traceId
      traceId: (req.headers['x-trace-id'] as string) || undefined,
      details,
    };

    res.status(status).json(payload);
  }
}