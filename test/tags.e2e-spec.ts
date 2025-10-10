/**
 * E2E：Tags 模块
 * - 验证创建/列表/详情/更新/删除与冲突/不存在等路径
 * - 独立创建 app 实例，并对齐 main.ts 的全局中间层（Validation/CORS/Helmet/异常/日志/响应包装）
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { RequestIdMiddleware } from '../src/common/middleware/request-id.middleware';

describe('Tags (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 初始化 Prisma 并清空数据，确保干净状态
    prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.tag.deleteMany();

    app = mod.createNestApplication();

    // 对齐 main.ts 的全局配置
    app.use(helmet());
    app.use(new RequestIdMiddleware().use);
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('POST /tags -> 201 Created', async () => {
    const res = await request(app.getHttpServer())
      .post('/tags')
      .send({ name: 'JavaScript', slug: 'javascript', description: 'ECMAScript', color: '#F7DF1E' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      name: 'JavaScript',
      slug: 'javascript',
      description: 'ECMAScript',
      color: '#F7DF1E',
    });
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /tags duplicate slug -> 409', async () => {
    await request(app.getHttpServer())
      .post('/tags')
      .send({ name: 'Node.js', slug: 'javascript' })
      .expect(409);
  });

  it('GET /tags list -> 200 OK with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/tags')
      .query({ page: 1, pageSize: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /tags/:id -> 200 OK', async () => {
    // 先拿一个 id
    const list = await request(app.getHttpServer()).get('/tags').expect(200);
    const id = list.body.data.items[0].id as string;

    const detail = await request(app.getHttpServer()).get(`/tags/${id}`).expect(200);
    expect(detail.body.success).toBe(true);
    expect(detail.body.data.id).toBe(id);
  });

  it('PATCH /tags/:id -> 200 OK & slug unique', async () => {
    // 新建另一个 tag 以测试 slug 冲突
    const created = await request(app.getHttpServer())
      .post('/tags')
      .send({ name: 'TypeScript', slug: 'typescript' })
      .expect(201);

    const id = created.body.data.id as string;

    // 更新 name
    const updated = await request(app.getHttpServer())
      .patch(`/tags/${id}`)
      .send({ name: 'TS' })
      .expect(200);

    expect(updated.body.data.name).toBe('TS');

    // 将其 slug 改为已存在的 'javascript'，应 409
    await request(app.getHttpServer())
      .patch(`/tags/${id}`)
      .send({ slug: 'javascript' })
      .expect(409);
  });

  it('DELETE /tags/:id -> 204', async () => {
    // 新建一个 tag 后删除
    const created = await request(app.getHttpServer())
      .post('/tags')
      .send({ name: 'ToDelete', slug: 'to-delete' })
      .expect(201);

    const id = created.body.data.id as string;

    await request(app.getHttpServer()).delete(`/tags/${id}`).expect(204);

    // 再次删除/查询应 404
    await request(app.getHttpServer()).delete(`/tags/${id}`).expect(404);
    await request(app.getHttpServer()).get(`/tags/${id}`).expect(404);
  });
});