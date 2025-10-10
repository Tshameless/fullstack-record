// src/health/health.controller.ts
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'; // Swagger 注解

/**
 * HealthController
 * - 提供健康检查（Health Check）端点，用于外部探测应用是否存活、是否可接受流量。
 * - 常用于：Kubernetes/LB 健康检查、监控系统心跳、CI/CD 烟雾测试等。
 */
@ApiTags('Health') // 在 Swagger 文档中归类到 "Health" 分组
@Controller('health')
export class HealthController {
  /**
   * GET /health
   * 返回一个简洁的健康状态对象：
   * - status: 字面量 "ok"，表示就绪
   * - timestamp: 服务端时间戳，方便观测与日志关联
   * - uptime: 进程已运行秒数（process.uptime()），反映应用稳定性
   * - env: 当前 NODE_ENV（未设置时默认为 "development"）
   *
   * 说明：
   * - 健康检查设计不宜过重，一般只做进程与入站链路检查；
   *   若要做深度依赖探测（DB/Redis/外部服务），推荐另设 /healthz/deep 或 /ready 区分探活/就绪。
   */
  @Get()
  @HttpCode(200) // 显式指定 HTTP 状态码为 200（与默认一致，增强可读性/文档一致性）
  @ApiOperation({ summary: '健康检查：用于探测服务是否就绪/存活' })
  @ApiOkResponse({
    description: '统一成功响应 { success, data, timestamp }；其中 data 为健康状态对象',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true, description: '是否成功' },
        data: {
          type: 'object',
          description: '健康状态',
          properties: {
            status: { type: 'string', example: 'ok', description: '健康状态' },
            timestamp: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z', description: '服务器时间戳' },
            uptime: { type: 'number', example: 123, description: '进程已运行秒数' },
            env: { type: 'string', example: 'development', description: '当前运行环境' },
          },
          required: ['status', 'timestamp', 'uptime', 'env'],
        },
        timestamp: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z', description: '服务器时间戳' },
      },
      required: ['success', 'data', 'timestamp'],
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      env: process.env.NODE_ENV ?? 'development',
    };
  }
}