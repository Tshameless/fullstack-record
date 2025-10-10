/**
 * QueryTagDto
 * 用途：标签列表查询与分页筛选的查询参数（?page=1&pageSize=10&q=...）
 * - 提供分页、搜索、排序、ID 过滤等功能
 * - 注意：ValidationPipe({ transform: true }) 将把字符串参数转换为指定类型
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const SORT_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;
type SortField = (typeof SORT_FIELDS)[number];

export class QueryTagDto {
  /**
   * 页码（从 1 开始）
   */
  @ApiPropertyOptional({
    description: '页码（从 1 开始）',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page 必须为整数' })
  @Min(1, { message: 'page 最小为 1' })
  page: number = 1;

  /**
   * 每页条数（1~100，默认 10）
   */
  @ApiPropertyOptional({
    description: '每页条数（1~100）',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize 必须为整数' })
  @Min(1, { message: 'pageSize 最小为 1' })
  @Max(100, { message: 'pageSize 最大为 100' })
  pageSize: number = 10;

  /**
   * 搜索关键字（对 name/slug/description 进行模糊匹配）
   */
  @ApiPropertyOptional({
    description: '搜索关键字（对 name/slug/description 模糊匹配）',
    example: 'script',
  })
  @IsOptional()
  @IsString({ message: 'q 必须为字符串' })
  q?: string;

  /**
   * 排序字段（name/createdAt/updatedAt）
   */
  @ApiPropertyOptional({
    description: '排序字段',
    enum: SORT_FIELDS,
    example: 'name',
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(SORT_FIELDS as unknown as string[], { message: 'sortBy 仅允许 name/createdAt/updatedAt' })
  sortBy: SortField = 'createdAt';

  /**
   * 排序方式（asc/desc）
   */
  @ApiPropertyOptional({
    description: '排序方式',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortOrder 仅允许 asc/desc' })
  sortOrder: 'asc' | 'desc' = 'desc';

  /**
   * 通过 ID 过滤（逗号分隔字符串 -> 数组）
   * - 示例：?ids=1,2,3
   * - 生产中建议使用 UUID 或数据库自增主键格式，此处为通用字符串示例
   */
  @ApiPropertyOptional({
    description: '通过 ID 过滤，多值用逗号分隔（例：1,2,3）',
    example: '1,2,3',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (Array.isArray(value)) return value;
    // 将 "1,2,3" 拆分为 ["1","2","3"]
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  @IsArray({ message: 'ids 必须为字符串数组' })
  @ArrayNotEmpty({ message: 'ids 至少包含一个元素' })
  ids?: string[];
}