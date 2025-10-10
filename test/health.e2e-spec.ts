// test/health.e2e-spec.ts
/**
 * 端到端（E2E）测试：通过 HTTP 层验证 /health 路由行为
 *
 * - 使用 @nestjs/testing 构建独立的应用实例（不依赖 main.ts 启动的真实进程）
 * - 使用 supertest 发起 HTTP 请求，断言响应状态码与返回体结构
 *
 * 注意：
 * - E2E 更偏黑盒测试：从“外部”调用接口，关注路由、中间件、管道、过滤器等组合效果
 * - 相比单测（直接调用 service/controller），E2E 运行更慢，但能发现集成层面的问题
 */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 1) 通过 TestingModule 创建应用（等价于把 AppModule 跑起来）
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 2) 创建 Nest 应用实例（与 main.ts 的流程相似，但在测试进程中进行）
    app = moduleFixture.createNestApplication();

    // 3) 在 E2E 中也可配置与 main.ts 一致的全局能力
    app.use(helmet());
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
    // 4) 关闭测试用应用，释放端口/资源
    await app.close();
  });

  it('GET /health should return 200 with wrapped payload', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);

    // 断言统一包装外层
    expect(res.body).toHaveProperty('success', true);
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body).toHaveProperty('data');

    // 断言 data 内部结构：存在 status/timestamp/uptime/env 字段
    const data = res.body.data;
    expect(data).toHaveProperty('status', 'ok');
    expect(typeof data.timestamp).toBe('string');
    expect(typeof data.uptime).toBe('number');
    expect(typeof data.env).toBe('string');
  });
});