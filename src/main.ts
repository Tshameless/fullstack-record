import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // OpenAPI 文档（Swagger）

/**
 * 应用启动入口（Bootstrap 函数）
 * - 集中启用全局中间层能力（校验、CORS、安全、日志、异常）
 * - 注意：E2E 测试通常自行创建 app 实例，不会自动应用这里的配置，
 *   测试中需手动对齐（示例见 test/health.e2e-spec.ts）
 */
async function bootstrap() {
  // 1) 创建 Nest 应用实例（默认使用 Express 作为 HTTP 平台）
  const app = await NestFactory.create(AppModule);

  /**
   * 2) 安全与请求标识中间件
   * - Helmet：自动设置常见安全相关 HTTP 头
   * - RequestIdMiddleware：为每个请求注入 traceId（若客户端未提供）
   */
  app.use(helmet());
  app.use(new RequestIdMiddleware().use);

  /**
   * 3) 启用 CORS（跨域资源共享）
   * - 生产建议将 origin 配置为白名单或具体域名
   */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  /**
   * 4) 启用全局参数校验管道（ValidationPipe）
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * 5) 启用全局异常过滤器与日志拦截器
   * - 异常过滤器统一错误响应结构
   * - 日志拦截器记录请求耗时
   * - 统一响应包装（TransformInterceptor）可择时启用
   */
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(), // 启用统一成功响应包装：{ success, data, timestamp }
  );

  /**
   * 6) OpenAPI 文档（Swagger）
   * - 默认在 development 与 test 环境启用；生产环境可通过设置 ENABLE_SWAGGER='true' 显式开启
   * - 访问路径：/docs（Swagger UI）与 /docs-json（OpenAPI JSON）
   * - 注意：E2E 测试不会依赖文档，因此该配置不应影响测试
   */
  const enableSwagger =
    (process.env.NODE_ENV !== 'production') || process.env.ENABLE_SWAGGER === 'true';
  if (enableSwagger) {
    // 使用 DocumentBuilder 构建基础文档信息
    const config = new DocumentBuilder()
      .setTitle('Fullstack Record API') // 文档标题
      .setDescription('本项目的后端 API 文档（基于 NestJS + Swagger）') // 文档描述
      .setVersion('1.0.0') // 版本
      // 如需基于 Header 的 API Key，可在此开启并在守卫中校验
      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'api-key',
      )
      // 如需 JWT Bearer，可启用下行并在需要的路由使用 @ApiBearerAuth()
      // .addBearerAuth()
      .build();

    // 生成 OpenAPI 文档对象
    const document = SwaggerModule.createDocument(app, config, {
      // 按需包含额外元数据（如通用响应包装），避免改变实际响应
      // deepScanRoutes: true,
    });

    // 在 /docs 挂载 Swagger UI，/docs-json 返回 JSON
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'docs-json',
      customSiteTitle: 'Fullstack Record API Docs',
      swaggerOptions: {
        persistAuthorization: true, // 刷新后保留授权
        displayRequestDuration: true,
      },
    });
  }

  /**
   * 6) 优雅关停与启动 HTTP 服务
   * - enableShutdownHooks：监听 SIGTERM/SIGINT，触发模块生命周期钩子，便于释放资源
   */
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
