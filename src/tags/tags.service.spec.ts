/**
 * 单元测试：TagsService（使用内存 Mock Prisma）
 * - 覆盖 create / update / remove / findById / query 的核心行为与边界
 * - 适配新版 TagsService 依赖 PrismaService 且方法均为异步
 */
import { TagsService } from './tags.service';

class InMemoryPrisma {
  private store = new Map<string, any>();
  // 简单字符串 ID 生成
  private nextId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  tag = {
    findUnique: async ({ where }: any) => {
      if (where.id) {
        return this.store.get(where.id) ?? null;
      }
      if (where.slug) {
        for (const t of this.store.values()) {
          if (t.slug === where.slug) return t;
        }
      }
      return null;
    },
    create: async ({ data }: any) => {
      const id = this.nextId();
      const now = new Date();
      const entity = {
        id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        color: data.color ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.store.set(id, entity);
      return entity;
    },
    update: async ({ where, data }: any) => {
      const existed = this.store.get(where.id);
      if (!existed) return null;
      const updated = {
        ...existed,
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        updatedAt: new Date(),
      };
      this.store.set(where.id, updated);
      return updated;
    },
    delete: async ({ where }: any) => {
      const existed = this.store.get(where.id);
      if (!existed) return null;
      this.store.delete(where.id);
      return existed;
    },
    count: async ({ where }: any) => {
      return (await this.findMany({ where })).length;
    },
    findMany: async ({ where, orderBy, skip = 0, take = 100 }: any) => {
      let list = Array.from(this.store.values());
      if (where?.id?.in?.length) {
        const set = new Set(where.id.in);
        list = list.filter((t) => set.has(t.id));
      }
      if (where?.OR?.length) {
        const kw = (where.OR[0]?.name?.contains ??
          where.OR[1]?.slug?.contains ??
          where.OR[2]?.description?.contains) as string;
        const lower = kw.toLowerCase();
        list = list.filter(
          (t) =>
            t.name?.toLowerCase().includes(lower) ||
            t.slug?.toLowerCase().includes(lower) ||
            t.description?.toLowerCase().includes(lower),
        );
      }
      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const dir = orderBy[field] === 'asc' ? 1 : -1;
        list.sort((a, b) => (a[field] < b[field] ? -1 * dir : a[field] > b[field] ? 1 * dir : 0));
      }
      return list.slice(skip, skip + take);
    },
  };
}

describe('TagsService with Mock Prisma', () => {
  let svc: TagsService;
  let prisma: any;

  beforeEach(() => {
    prisma = new InMemoryPrisma() as any;
    svc = new TagsService(prisma);
  });

  it('should create tag and ensure unique slug', async () => {
    const t = await svc.create({ name: 'JS', slug: 'js' });
    expect(t.id).toBeDefined();
    expect(t.createdAt).toBeDefined();

    await expect(svc.create({ name: 'Other', slug: 'js' })).rejects.toBeTruthy();
  });

  it('should update fields and handle slug conflict', async () => {
    const a = await svc.create({ name: 'A', slug: 'a' });
    const b = await svc.create({ name: 'B', slug: 'b' });

    const updated = await svc.update(a.id, { name: 'A1' });
    expect(updated.name).toBe('A1');

    // change slug to b (conflict)
    await expect(svc.update(a.id, { slug: 'b' })).rejects.toBeTruthy();
  });

  it('should remove and not found after deletion', async () => {
    const t = await svc.create({ name: 'Del', slug: 'del' });
    await svc.remove(t.id);
    await expect(svc.findById(t.id)).rejects.toBeTruthy();
  });

  it('should query with pagination and search', async () => {
    await svc.create({ name: 'JavaScript', slug: 'javascript' });
    await svc.create({ name: 'TypeScript', slug: 'typescript' });

    const r1 = await svc.query({ page: 1, pageSize: 1, sortBy: 'createdAt', sortOrder: 'desc' });
    expect(r1.items.length).toBe(1);
    expect(r1.total).toBeGreaterThanOrEqual(2);

    const r2 = await svc.query({ q: 'script', page: 1, pageSize: 10, sortBy: 'name', sortOrder: 'asc' });
    expect(r2.items.length).toBeGreaterThan(0);
  });
});