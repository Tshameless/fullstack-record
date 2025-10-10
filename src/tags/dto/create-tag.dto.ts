/**
 * CreateTagDto
 * 用途：创建标签（Tag）的请求体模型。
 * - 该 DTO 假设 Tag 至少包含 name 与唯一 slug，可选描述与颜色。
 * - 已结合 class-validator 与 @nestjs/swagger：
 *   - 运行时校验（ValidationPipe）保障类型与规则
 *   - 文档注解（ApiProperty）在 Swagger 中展示示例与说明
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateTagDto {
  /**
   * 标签名称
   * - 用户可见的名称，一般用于管理后台或前端展示
   * - 限制：长度 1~50
   */
  @ApiProperty({
    description: '标签名称（1~50）',
    example: 'JavaScript',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'name 必须为字符串' })
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, 50, { message: 'name 长度需在 1~50 之间' })
  name!: string;

  /**
   * 标签唯一标识（slug）
   * - 一般用于路径、筛选参数等（推荐只用小写字母、数字与中划线）
   * - 需要唯一，服务端应在持久化层或业务层保证唯一性
   * - 正则：^[a-z0-9]+(?:-[a-z0-9]+)*$
   */
  @ApiProperty({
    description: '标签唯一标识（slug），仅小写字母、数字与中划线，例：javascript, nodejs, web-dev',
    example: 'javascript',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsString({ message: 'slug 必须为字符串' })
  @IsNotEmpty({ message: 'slug 不能为空' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 仅允许小写字母、数字与中划线（例：javascript、web-dev）',
  })
  slug!: string;

  /**
   * 标签描述（可选）
   * - 可用于 SEO 或说明
   * - 限制：最多 200 字符
   */
  @ApiPropertyOptional({
    description: '标签描述（可选，<=200）',
    example: '与 ECMAScript 与浏览器脚本相关的所有内容',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'description 必须为字符串' })
  @MaxLength(200, { message: 'description 最长 200 字符' })
  description?: string;

  /**
   * 标签颜色（可选）
   * - 前端展示使用，格式建议为 6 位十六进制颜色，如 #F7DF1E
   * - 仅做格式约束，不涉及调色板枚举
   */
  @ApiPropertyOptional({
    description: '标签颜色（可选，十六进制颜色，如 #F7DF1E）',
    example: '#F7DF1E',
    pattern: '^#(?:[0-9a-fA-F]{6})$',
  })
  @IsOptional()
  @IsString({ message: 'color 必须为字符串' })
  @Matches(/^#(?:[0-9a-fA-F]{6})$/, {
    message: 'color 请使用 6 位十六进制颜色（示例：#F7DF1E）',
  })
  color?: string;
}