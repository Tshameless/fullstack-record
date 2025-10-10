import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'; // Swagger 注解：控制器分组、操作摘要与响应描述

@ApiTags('App') // 将该控制器归入 "App" 分组，便于在 Swagger UI 中分组展示
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 根路由示例
   * - 实际返回值由全局 TransformInterceptor 统一包装为：
   *   { success: true, data: 'Hello World!', timestamp: 'ISO8601' }
   */
  @Get()
  @HttpCode(200) // 显式指定 HTTP 状态码为 200，保持与 /health 一致，增强可读性
  @ApiOperation({ summary: '示例：返回 Hello World 文本' })
  @ApiOkResponse({
    description: '统一成功响应 { success, data, timestamp }；其中 data 为字符串',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true, description: '是否成功' },
        data: { type: 'string', example: 'Hello World!', description: '业务数据载荷' },
        timestamp: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z', description: '服务器时间戳' },
      },
      required: ['success', 'data', 'timestamp'],
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
