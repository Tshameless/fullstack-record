// test/error-filter.e2e-spec.ts
/**
 * 验证全局异常过滤器的统一错误响应格式
 * - 这里构建一个独立的 app，并手动注册与生产一致的全局过滤器/拦截器
 * - 通过访问不存在的路由，触发 404，断言响应结构
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

describe('HttpExceptionFilter (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 对齐 main.ts 中的全局配置（必要项）
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /__not_found__ 应返回统一错误结构（404）', async () => {
    const res = await request(app.getHttpServer())
      .get('/__not_found__')
      .expect(404);

    expect(res.body).toHaveProperty('code', 404);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('path', '/__not_found__');
    expect(res.body).toHaveProperty('method', 'GET');
    expect(res.body).toHaveProperty('timestamp');
    // traceId 默认为 undefined，这里不强制断言
  });
});