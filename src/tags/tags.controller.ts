/**
 * TagsController
 * - RESTful 控制器：提供标签的 CRUD 与查询接口。
 * - 本控制器严格使用 DTO 与全局 ValidationPipe（在 main.ts 已启用）进行参数校验与转换。
 * - 统一响应：由全局 TransformInterceptor 包装为 { success, data, timestamp }。
 */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';

@ApiTags('Tags') // Swagger 分组
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  /**
   * 创建标签
   * - 成功：201 Created，返回创建的标签实体
   * - 失败：409 Conflict（slug 重复）
   */
  @Post()
  @ApiOperation({ summary: '创建标签' })
  @ApiCreatedResponse({
    description: '创建成功，返回标签实体',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'JavaScript' },
            slug: { type: 'string', example: 'javascript' },
            description: { type: 'string', example: '与 ECMAScript 相关的内容' },
            color: { type: 'string', example: '#F7DF1E' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'slug', 'createdAt', 'updatedAt'],
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
      required: ['success', 'data', 'timestamp'],
    },
  })
  @ApiConflictResponse({ description: 'slug 重复（409 Conflict）' })
  create(@Body() dto: CreateTagDto) {
    return this.tags.create(dto);
  }

  /**
   * 列表查询（分页/搜索/排序/ID 过滤）
   * - 返回：items + total + page + pageSize
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '查询标签（分页/搜索/排序/ID 过滤）' })
  @ApiOkResponse({
    description: '查询成功，返回分页结果',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  color: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'name', 'slug', 'createdAt', 'updatedAt'],
              },
            },
            total: { type: 'number', example: 1 },
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 10 },
          },
          required: ['items', 'total', 'page', 'pageSize'],
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
      required: ['success', 'data', 'timestamp'],
    },
  })
  list(@Query() query: QueryTagDto) {
    return this.tags.query(query);
  }

  /**
   * 获取详情
   * - 成功：200 OK
   * - 失败：404 Not Found
   */
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '获取标签详情' })
  @ApiOkResponse({ description: '获取成功，返回标签实体' })
  @ApiNotFoundResponse({ description: '不存在（404 Not Found）' })
  detail(@Param('id') id: string) {
    return this.tags.findById(id);
  }

  /**
   * 部分更新
   * - 成功：200 OK
   * - 失败：404 Not Found / 409 Conflict（slug 重复）
   */
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '更新标签（部分更新）' })
  @ApiOkResponse({ description: '更新成功，返回最新实体' })
  @ApiNotFoundResponse({ description: '不存在（404 Not Found）' })
  @ApiConflictResponse({ description: 'slug 重复（409 Conflict）' })
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tags.update(id, dto);
  }

  /**
   * 删除
   * - 成功：204 No Content（没有响应体）
   * - 失败：404 Not Found
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '删除标签' })
  @ApiNoContentResponse({ description: '删除成功（204 No Content）' })
  @ApiNotFoundResponse({ description: '不存在（404 Not Found）' })
  async remove(@Param('id') id: string) {
    await this.tags.remove(id);
  }
}