import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 全局配置模块：读取环境变量、提供配置服务
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // 限流模块与守卫
import { APP_GUARD } from '@nestjs/core'; // 全局守卫注册令牌
import { LoggerModule } from 'nestjs-pino'; // 结构化日志模块（基于 pino）
import * as Joi from 'joi'; // 配置校验（Joi）
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module'; // 引入 Health 模块
import { TagsModule } from './tags/tags.module'; // 引入 Tags 模块

/**
 * AppModule
 * - 应用的根模块：集中注册子模块、控制器、服务等。
 * - 在 imports 中：
 *   1) ConfigModule.forRoot({ isGlobal: true })：全局加载 .env 与 process.env
 *   2) HealthModule：对外暴露 /health
 */
@Module({
  // imports 用于引入其他模块（如领域模块、技术模块：HealthModule、ConfigModule 等）
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 作为全局模块，无需在每个子模块重复导入
      // envFilePath: ['.env.local', '.env'],
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      /**
       * 配置校验（Joi）
       * - 在应用启动前验证关键环境变量的类型/取值范围，给出明确错误
       * - allowUnknown: true 以兼容云平台自动注入的变量
       * - abortEarly: true 有第一个错误即停止（如需列全错可设为 false）
       */
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development')
          .description('运行环境'),
        PORT: Joi.number().integer().min(1).max(65535).default(3000).description('HTTP 服务端口'),
        // 可选密钥：如启用 API Key 守卫可改为 required()
        API_KEY: Joi.string().optional().description('服务访问密钥（可选）'),
        // 限流参数（如将来想用环境驱动，可从此处读取）
        RATE_LIMIT_TTL_MS: Joi.number().integer().min(1000).default(60000).description('限流窗口时长(毫秒)'),
        RATE_LIMIT_LIMIT: Joi.number().integer().min(1).default(10).description('限流窗口内最大请求数'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      cache: true,
    }),
    /**
     * 结构化日志（@nestjs/pino）
     * - pinoHttp: 启用 HTTP 请求日志（包含 method、url、statusCode、responseTime 等）
     * - genReqId: 复用 RequestIdMiddleware 注入的 traceId 或客户端传入的 x-trace-id
     * - customProps: 将 traceId 附加到日志对象，便于检索
     * - transport: 非生产环境使用 pino-pretty 美化输出；生产输出纯 JSON 供采集
     */
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req: any) => req.headers?.['x-trace-id'] ?? req.traceId ?? undefined,
        customProps: (req: any) => ({
          traceId: req.headers?.['x-trace-id'] ?? req.traceId,
        }),
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: true,
                },
              },
        // 与自定义 LoggingInterceptor 共存；如需仅用 pino 的请求日志，可设为 false 并移除拦截器
        autoLogging: true,
      },
    }),
    /**
     * 全局限流配置（v6 写法）
     * - 需使用 throttlers 数组，每个元素配置一个限流窗口（ttl 单位毫秒）
     */
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 60,000 ms = 60 秒窗口
          limit: 10,  // 每 IP 每 60 秒最多 10 次请求
        },
      ],
    }),
    PrismaModule,
    HealthModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 将 ThrottlerGuard 注册为全局守卫，使所有路由默认受限流保护
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
