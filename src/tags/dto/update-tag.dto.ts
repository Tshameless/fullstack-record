/**
 * UpdateTagDto
 * 用途：更新标签（Tag）的请求体模型。
 * - 与 CreateTagDto 基本相同，但全部字段为可选（Partial）
 * - 仅校验存在的字段，支持部分更新
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateTagDto {
  @ApiPropertyOptional({
    description: '标签名称（1~50）',
    example: 'JavaScript',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'name 必须为字符串' })
  @IsNotEmpty({ message: 'name 不能为空' })
  @Length(1, 50, { message: 'name 长度需在 1~50 之间' })
  name?: string;

  @ApiPropertyOptional({
    description: '标签唯一标识（slug），仅小写字母、数字与中划线，例：javascript, nodejs, web-dev',
    example: 'javascript',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsOptional()
  @IsString({ message: 'slug 必须为字符串' })
  @IsNotEmpty({ message: 'slug 不能为空' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 仅允许小写字母、数字与中划线（例：javascript、web-dev）',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: '标签描述（可选，<=200）',
    example: '与 ECMAScript 与浏览器脚本相关的所有内容',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'description 必须为字符串' })
  @MaxLength(200, { message: 'description 最长 200 字符' })
  description?: string;

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