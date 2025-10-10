/**
 * TagsService（Prisma 版）
 * - 使用 Prisma 替代内存 Map，实现持久化存储
 * - 维持原有业务语义：slug 唯一、404/409、分页/搜索/排序
 */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { QueryTagDto } from './dto/query-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建标签
   * - 保证 slug 唯一；重复时抛出 409 Conflict
   */
  async create(dto: CreateTagDto) {
    // 先查 slug 是否存在
    const existed = await this.prisma.tag.findUnique({ where: { slug: dto.slug } });
    if (existed) {
      throw new ConflictException(`slug already exists: ${dto.slug}`);
    }
    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description ?? null,
        color: dto.color ?? null,
      },
    });
  }

  /**
   * 更新标签
   * - 允许部分字段更新；若更新 slug，需要保证唯一性
   */
  async update(id: string, dto: UpdateTagDto) {
    const existed = await this.prisma.tag.findUnique({ where: { id } });
    if (!existed) {
      throw new NotFoundException(`Tag not found: ${id}`);
    }
    if (dto.slug && dto.slug !== existed.slug) {
      const dup = await this.prisma.tag.findUnique({ where: { slug: dto.slug } });
      if (dup) {
        throw new ConflictException(`slug already exists: ${dto.slug}`);
      }
    }
    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        slug: dto.slug ?? undefined,
        description: dto.description === undefined ? undefined : dto.description,
        color: dto.color === undefined ? undefined : dto.color,
      },
    });
  }

  /**
   * 删除标签
   * - 不存在时抛 404
   */
  async remove(id: string): Promise<void> {
    const existed = await this.prisma.tag.findUnique({ where: { id } });
    if (!existed) {
      throw new NotFoundException(`Tag not found: ${id}`);
    }
    await this.prisma.tag.delete({ where: { id } });
  }

  /**
   * 获取详情（按 id）
   */
  async findById(id: string) {
    const existed = await this.prisma.tag.findUnique({ where: { id } });
    if (!existed) {
      throw new NotFoundException(`Tag not found: ${id}`);
    }
    return existed;
  }

  /**
   * 列表查询（分页/搜索/排序/ID 过滤）
   * - 搜索字段：name / slug / description（包含式大小写不敏感）
   * - 排序字段：见 QueryTagDto 的 sortBy/sortOrder
   */
  async query(dto: QueryTagDto): Promise<{ items: any[]; total: number; page: number; pageSize: number }> {
    const pageSize = dto.pageSize ?? 10;
    const page = dto.page ?? 1;

    // where 条件
    const where: any = {};
    if (dto.ids?.length) {
      where.id = { in: dto.ids };
    }
    if (dto.q) {
      const kw = dto.q;
      where.OR = [
        { name: { contains: kw, mode: 'insensitive' } },
        { slug: { contains: kw, mode: 'insensitive' } },
        { description: { contains: kw, mode: 'insensitive' } },
      ];
    }

    // 排序
    const sortBy = dto.sortBy ?? 'createdAt';
    const sortOrder = dto.sortOrder ?? 'asc';
    const orderBy: any = { [sortBy]: sortOrder };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.tag.count({ where }),
      this.prisma.tag.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { items, total, page, pageSize };
  }
}