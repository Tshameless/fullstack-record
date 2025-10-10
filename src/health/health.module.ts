// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * HealthModule
 * - 模块是 Nest 的组织单元，用于聚合控制器、服务、提供者。
 * - 该模块只暴露一个最小的健康检查控制器，便于在 AppModule 中引用。
 */
@Module({
  imports: [],
  controllers: [HealthController], 
  providers: [],
})
export class HealthModule {}