/**
 * TagsModule
 * - 职责：聚合与标签（Tag）相关的控制器与服务。
 * - 当前实现使用内存仓库（Map）存储数据，便于教学与快速验证。
 *   在接入数据库（如 Prisma）时，仅需替换服务的持久化实现，不影响控制器层。
 */
import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}