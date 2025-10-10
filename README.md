# fullstack-record

一个基于 NestJS 11 + TypeScript 的学习与实践项目，目标是在真实工程环境中掌握 Node.js/NestJS 的核心能力，包括模块化设计、参数校验、异常处理、拦截器、测试、以及生产化部署准备等。

本 README 汇总：
- 技术选型与选型理由
- Nest 基础概念速览（模块/控制器/服务/DI/管道/过滤器/守卫/拦截器/中间件/DTO）
- 当前项目实现状态与目录结构
- 运行方式与测试指南
- 后续学习路线与扩展建议（路线 A：全局中间层；路线 B：领域 CRUD）

## 快速开始

- 安装依赖
  - npm i
- 开发启动
  - npm run start:dev
- 访问健康检查
  - http://localhost:3000/health
- 运行测试
  - 单元测试：npm test
  - 端到端（E2E）：npm run test:e2e

## 技术选型与理由

- NestJS 11（@nestjs/common、@nestjs/core、@nestjs/platform-express）
  - 理由：在 Node.js 生态中提供“有边界的工程化框架”，具备 IOC/DI、模块化、装饰器编程模型，易于扩展与维护；默认 Express 平台，生态成熟。
- TypeScript
  - 理由：强类型带来更好的可维护性与重构体验；配合装饰器、反射元数据（reflect-metadata）提升开发效率。
- class-validator + class-transformer
  - 理由：与 ValidationPipe 配合进行 DTO 层参数校验与类型转换，前后端契约清晰、可防御脏数据。
- Jest + ts-jest + @nestjs/testing + supertest
  - 理由：Jest 生态稳定；ts-jest 便于 TS 直接测试；@nestjs/testing 提供 Nest 应用级测试工具；supertest 用于 E2E 的 HTTP 断言。
- ESLint + Prettier
  - 理由：统一代码风格与质量；eslint-config-prettier/插件做冲突消解；在团队协作中尤为重要。
- ts-node + tsconfig-paths
  - 理由：开发阶段快速运行与路径解析支持（比如别名路径解析）。
- 预留/待选：
  - Prisma（ORM）
    - 理由：类型安全、迁移工具链完善、开发体验友好。若引入数据库场景，推荐接入。
  - 安全与生产化中间件：Helmet、速率限制（@nestjs/throttler）、CORS 细粒度配置、统一日志等。
  - 配置管理：@nestjs/config（ConfigModule）分环境配置与校验。

## Nest 基础概念速览（结合本项目实践）

- Module（模块）
  - 用于组织业务域或技术能力的单元。imports/controllers/providers/export 四类元信息构成。
  - AppModule 是根模块，HealthModule 是技术模块（健康检查能力）。
- Controller（控制器）
  - 负责路由与请求分发。使用 @Controller 和 @Get/@Post 等装饰器声明。
  - 示例：HealthController 暴露 GET /health。
- Provider / Service（提供者/服务）
  - 可被注入（DI）的类，用于封装业务逻辑与可复用能力。使用 @Injectable() 装饰器声明。
  - 例如 AppService 提供 getHello()。
- DI/IoC（依赖注入/控制反转）
  - 通过构造函数注入依赖。Nest 负责实例生命周期与注入关系管理，利于解耦与测试。
- Pipe（管道）
  - 在控制器方法执行前进行转换/校验。ValidationPipe 搭配 DTO 实现强约束的参数校验（whitelist/forbidNonWhitelisted/transform）。
  - 本项目已在 main.ts 启用全局 ValidationPipe。
- Filter（异常过滤器）
  - 捕获异常并统一格式化响应。建议全局化一个 HttpExceptionFilter，以实现统一错误结构与日志。
- Guard（守卫）
  - 决定路由是否可执行，常用于认证/鉴权（如 API Key / JWT / 角色）。
- Interceptor（拦截器）
  - 可用于日志、响应包装、缓存、超时等横切能力。建议实现 LoggingInterceptor 与 TransformInterceptor。
- Middleware（中间件）
  - 基于 Express 的通用请求前置逻辑（如解析、打点）。在模块 configure 生命周期中注册。
- DTO（数据传输对象）
  - 描述请求/响应契约；配合 class-validator 声明校验规则（例如 @IsString()、@IsInt() 等）。
  - 建议控制器层只接受 DTO，以隔离外部输入与内部领域模型。

## 当前项目实现状态

- 全局配置（src/main.ts）
  - 启用 CORS：允许跨域（本地开发场景更友好；生产需按 origin 限定）
  - 启用 ValidationPipe：whitelist + forbidNonWhitelisted + transform，确保入参契约严格
- 健康检查模块（src/health）
  - GET /health 返回 { status: 'ok', timestamp, uptime, env }
  - 用途：Kubernetes/LB 探活、监控心跳、CI/CD 烟雾测试
- 测试
  - 单元测试：src/app.controller.spec.ts
  - E2E 测试：test/app.e2e-spec.ts、test/health.e2e-spec.ts（基于 supertest）

## 目录结构（简述）

```
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
  health/
    health.controller.ts
    health.module.ts
  categories/
  documents/
    dto/
  prisma/
  search/
  tags/
test/
  app.e2e-spec.ts
  health.e2e-spec.ts
```

- 后续我们会在 common/ 下新增公共层（filters、interceptors、guards、pipes、middlewares）并做全局注册。

## 运行与调试

- 开发启动：npm run start:dev（热重载）
- 生产构建：npm run build
- 生产启动：npm run start:prod
- 调试：npm run start:debug 或使用 VSCode 调试配置（断点、Inspect）

常见问题
- 报错 “The 'class-validator' package is missing.”：
  - 需要安装 class-validator 与 class-transformer，然后重跑。
- E2E 没有执行：
  - 使用 npm run test:e2e（jest-e2e.json 会把 test 目录作为 rootDir）。
- 端口占用：
  - 修改环境变量 PORT 或在配置模块中统一管理端口。

## 代码约定与响应规范（建议）

- 统一错误响应结构（建议）：
  - { code: number, message: string, details?: any, timestamp: string, path: string }
  - 使用全局 HttpExceptionFilter 统一化输出，便于前端/监控一致处理。
- 统一成功响应包装（建议）：
  - { code: 0, data: any, message?: string, timestamp: string }
  - 使用 TransformInterceptor 在控制器返回数据后统一包装。
- 分页规范（建议）：
  - 查询参数：page、pageSize、sort、order、q
  - 响应：{ items: T[], page, pageSize, total }

## 环境变量与配置（建议）

- 引入 @nestjs/config 配置模块（ConfigModule.forRoot({ isGlobal: true })）
- 配置分环境 .env/.env.development/.env.test/.env.production
- 对关键信息进行校验（如使用 joi）与分环境覆盖
- 最终在 main.ts 读取 PORT 等关键配置统一控制

## 学习路线与下一步计划

- 路线 A（全局中间层，推荐先做）
  1) 全局异常过滤器 HttpExceptionFilter：统一错误结构、记录 traceId、时间戳、请求信息
  2) 全局日志拦截器 LoggingInterceptor：统计 method/url/status/耗时
  3) 全局响应包装 TransformInterceptor：统一成功响应结构
  4) 安全中间件：Helmet、CORS 精细化、速率限制（@nestjs/throttler）
  5) 可观测性：日志分层（访问日志/应用日志/错误日志）、基础指标（请求数、耗时分布）
- 路线 B（领域 CRUD）
  1) Tags 模块：DTO 校验、服务/控制器、分页筛选、单元 + E2E 测试
  2) Categories/Documents：抽象通用分页/筛选解析与响应结构
  3) （可选）接入 Prisma 与数据库，完善仓储层（Repository）与事务边界

## 项目脚本

- npm run start：nest start
- npm run start:dev：开发模式（watch）
- npm run start:debug：调试模式（inspect）
- npm run start:prod：生产（node dist/main）
- npm run build：构建
- npm run format：Prettier 格式化
- npm run lint：ESLint 检查/修复
- npm test：单元测试
- npm run test:watch：单测 watch
- npm run test:cov：覆盖率
- npm run test:e2e：端到端测试

---

如你希望，我可以按“路线 A”一步步在 src/common 下实现 filters/interceptors/guards，并在 main.ts 全局挂载，同时补充对应的单元与 E2E 测试；或转入“路线 B”实现 Tags 的完整 CRUD 与测试。