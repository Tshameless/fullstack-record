# Fullstack Record

一个基于 **NestJS 11 + TypeScript + Prisma + SQLite** 的全栈学习与实践项目，集成了完整的后端 API 开发技术栈，包括模块化设计、参数校验、异常处理、拦截器、数据库操作、测试以及生产化部署准备等。

## 🎯 项目概述

本项目是一个功能完整的标签管理系统，展示了现代 Node.js 后端开发的最佳实践，适合学习 NestJS 框架和全栈开发技术。

### ✨ 核心特性

- 🚀 **现代化技术栈** - NestJS 11 + TypeScript + Prisma + SQLite
- 🛡️ **企业级架构** - 模块化设计、依赖注入、中间件、拦截器
- 🔒 **安全防护** - Helmet 安全头、限流保护、CORS 配置
- 📊 **数据管理** - 完整的 CRUD 操作、数据验证、分页查询
- 🧪 **测试覆盖** - 单元测试、E2E 测试、测试工具链
- 📝 **API 文档** - Swagger/OpenAPI 自动生成文档
- 🔧 **开发工具** - 数据种子脚本、交互式管理工具、数据库可视化

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装与启动
```bash
# 1. 克隆项目并安装依赖
git clone <repository-url>
cd fullstack-record
npm install

# 2. 启动开发服务器
npm run start:dev

# 3. 访问应用
# API 服务: http://localhost:3000
# API 文档: http://localhost:3000/docs
# 健康检查: http://localhost:3000/health
```

### 数据库管理
```bash
# 查看数据库 (Prisma Studio)
npm run db:studio

# 添加种子数据
npm run db:seed

# 交互式数据管理
npm run db:manage
```

### 测试
```bash
# 单元测试
npm test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 🛠️ 技术栈详解

### 核心框架
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **NestJS** | 11.x | 后端框架 | 企业级 Node.js 框架，提供 IOC/DI、模块化、装饰器编程模型 |
| **TypeScript** | 5.x | 开发语言 | 强类型系统，提升代码质量和开发体验 |
| **Express** | 内置 | HTTP 服务器 | NestJS 默认平台，生态成熟稳定 |

### 数据库与 ORM
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **Prisma** | 6.x | ORM 框架 | 类型安全、迁移工具完善、开发体验友好 |
| **SQLite** | 3.x | 数据库 | 轻量级、零配置、适合开发和中小型应用 |

### 数据验证与转换
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **class-validator** | 0.14.x | 数据验证 | 装饰器式验证，与 DTO 完美配合 |
| **class-transformer** | 0.5.x | 数据转换 | 自动类型转换和序列化 |

### 安全与中间件
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **Helmet** | 8.x | 安全头 | 自动设置安全相关的 HTTP 头 |
| **@nestjs/throttler** | 6.x | 限流保护 | 防止 API 滥用，保护服务稳定 |
| **CORS** | 内置 | 跨域处理 | 支持跨域资源共享配置 |

### 日志与监控
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **nestjs-pino** | 4.x | 结构化日志 | 高性能日志库，支持 JSON 格式输出 |
| **pino-pretty** | 13.x | 日志美化 | 开发环境日志格式化显示 |

### 配置管理
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **@nestjs/config** | 4.x | 配置管理 | 环境变量管理、配置验证 |
| **Joi** | 18.x | 配置验证 | 强大的数据验证库，确保配置正确性 |

### API 文档
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **@nestjs/swagger** | 11.x | API 文档 | 自动生成 OpenAPI 文档 |
| **swagger-ui-express** | 5.x | 文档界面 | 提供可视化的 API 文档界面 |

### 测试框架
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **Jest** | 30.x | 测试框架 | 功能完整的 JavaScript 测试框架 |
| **ts-jest** | 29.x | TypeScript 支持 | Jest 的 TypeScript 预处理器 |
| **@nestjs/testing** | 11.x | NestJS 测试 | 提供 NestJS 应用级测试工具 |
| **supertest** | 7.x | HTTP 测试 | 用于 E2E 测试的 HTTP 断言库 |

### 代码质量
| 技术 | 版本 | 用途 | 理由 |
|------|------|------|------|
| **ESLint** | 9.x | 代码检查 | 静态代码分析，保证代码质量 |
| **Prettier** | 3.x | 代码格式化 | 统一代码风格，提升可读性 |

## 🏗️ NestJS 架构概念

### 核心概念
- **Module（模块）** - 组织业务域或技术能力的单元，包含 imports/controllers/providers/exports
- **Controller（控制器）** - 处理 HTTP 请求，使用装饰器定义路由
- **Service（服务）** - 封装业务逻辑，通过依赖注入使用
- **DTO（数据传输对象）** - 定义请求/响应数据结构，配合验证装饰器
- **Pipe（管道）** - 数据转换和验证，如 ValidationPipe
- **Filter（过滤器）** - 异常处理，统一错误响应格式
- **Guard（守卫）** - 权限控制，如认证、限流
- **Interceptor（拦截器）** - 横切关注点，如日志、响应转换
- **Middleware（中间件）** - 请求预处理，如请求 ID 注入

## 📁 项目结构详解

### 目录结构
```
fullstack-record/
├── 📁 src/                          # 源代码目录
│   ├── 📄 main.ts                   # 应用入口文件
│   ├── 📄 app.module.ts             # 根模块
│   ├── 📄 app.controller.ts         # 根控制器
│   ├── 📄 app.service.ts            # 根服务
│   ├── 📁 common/                   # 公共模块
│   │   ├── 📁 filters/              # 异常过滤器
│   │   │   └── 📄 http-exception.filter.ts
│   │   ├── 📁 interceptors/         # 拦截器
│   │   │   ├── 📄 logging.interceptor.ts
│   │   │   └── 📄 transform.interceptor.ts
│   │   └── 📁 middleware/            # 中间件
│   │       └── 📄 request-id.middleware.ts
│   ├── 📁 health/                   # 健康检查模块
│   │   ├── 📄 health.controller.ts
│   │   └── 📄 health.module.ts
│   ├── 📁 prisma/                   # 数据库模块
│   │   ├── 📄 prisma.module.ts
│   │   └── 📄 prisma.service.ts
│   └── 📁 tags/                     # 标签管理模块
│       ├── 📄 tags.controller.ts
│       ├── 📄 tags.service.ts
│       ├── 📄 tags.module.ts
│       └── 📁 dto/                  # 数据传输对象
│           ├── 📄 create-tag.dto.ts
│           ├── 📄 update-tag.dto.ts
│           ├── 📄 query-tag.dto.ts
│           └── 📄 index.ts
├── 📁 prisma/                       # 数据库相关
│   ├── 📄 schema.prisma             # 数据库模式定义
│   ├── 📄 dev.db                    # 开发数据库
│   ├── 📄 test.db                   # 测试数据库
│   └── 📁 migrations/               # 数据库迁移文件
├── 📁 scripts/                      # 脚本工具
│   ├── 📄 seed-data.js              # 种子数据脚本
│   ├── 📄 batch-add-tags.js         # 批量添加标签
│   ├── 📄 interactive-add.js        # 交互式添加数据
│   ├── 📄 interactive-update.js     # 交互式修改数据
│   └── 📄 update-data.js             # 数据更新脚本
├── 📁 test/                         # 测试文件
│   ├── 📄 app.e2e-spec.ts
│   ├── 📄 health.e2e-spec.ts
│   ├── 📄 tags.e2e-spec.ts
│   └── 📄 jest-e2e.json
├── 📁 dist/                         # 编译输出目录
├── 📄 package.json                  # 项目配置
├── 📄 tsconfig.json                 # TypeScript 配置
├── 📄 eslint.config.mjs             # ESLint 配置
└── 📄 README.md                     # 项目文档
```

### 核心文件说明

#### 🚀 应用入口
- **`src/main.ts`** - 应用启动入口，配置全局中间件、管道、过滤器
- **`src/app.module.ts`** - 根模块，注册所有子模块和全局配置

#### 🏗️ 业务模块
- **`src/tags/`** - 标签管理模块，包含完整的 CRUD 操作
- **`src/health/`** - 健康检查模块，用于服务监控
- **`src/prisma/`** - 数据库连接和配置

#### 🛡️ 公共组件
- **`src/common/filters/`** - 全局异常过滤器，统一错误处理
- **`src/common/interceptors/`** - 拦截器，处理日志和响应转换
- **`src/common/middleware/`** - 中间件，处理请求 ID 注入

#### 🗄️ 数据库
- **`prisma/schema.prisma`** - 数据库模式定义
- **`prisma/dev.db`** - 开发环境数据库文件
- **`prisma/migrations/`** - 数据库迁移历史

#### 🔧 开发工具
- **`scripts/`** - 数据管理脚本，支持种子数据、批量操作、交互式管理
- **`test/`** - 测试文件，包含单元测试和 E2E 测试

## 🎮 使用指南

### API 接口

#### 标签管理 API
| 方法 | 路径 | 描述 | 示例 |
|------|------|------|------|
| `GET` | `/tags` | 获取标签列表 | `GET /tags?page=1&pageSize=10` |
| `POST` | `/tags` | 创建标签 | `POST /tags` |
| `GET` | `/tags/:id` | 获取标签详情 | `GET /tags/123` |
| `PATCH` | `/tags/:id` | 更新标签 | `PATCH /tags/123` |
| `DELETE` | `/tags/:id` | 删除标签 | `DELETE /tags/123` |

#### 系统 API
| 方法 | 路径 | 描述 |
|------|------|------|
| `GET` | `/health` | 健康检查 |
| `GET` | `/docs` | API 文档 |
| `GET` | `/docs-json` | OpenAPI JSON |

### 数据管理工具

#### 🔧 数据库脚本
```bash
# 种子数据 - 添加示例标签
npm run db:seed

# 批量添加 - 添加技术栈标签
npm run db:add-tags

# 交互式管理 - 图形化数据管理
npm run db:manage

# 数据库可视化 - Prisma Studio
npm run db:studio
```

#### 📊 数据操作示例
```bash
# 添加标签
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"React","slug":"react","description":"React框架","color":"#61DAFB"}'

# 查询标签
curl http://localhost:3000/tags

# 更新标签
curl -X PATCH http://localhost:3000/tags/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"React.js","color":"#61DAFB"}'
```

### 开发与调试

#### 🚀 启动命令
```bash
# 开发模式（热重载）
npm run start:dev

# 生产构建
npm run build

# 生产启动
npm run start:prod

# 调试模式
npm run start:debug
```

#### 🧪 测试命令
```bash
# 单元测试
npm test

# 测试监听模式
npm run test:watch

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

#### 🔧 代码质量
```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 常见问题

#### ❓ 启动问题
- **端口占用**: 修改环境变量 `PORT` 或使用 `npm run start:dev -- --port 3001`
- **依赖缺失**: 运行 `npm install` 重新安装依赖
- **数据库连接**: 确保 SQLite 文件权限正确

#### ❓ 开发问题
- **热重载不工作**: 检查文件监听权限，重启开发服务器
- **类型错误**: 运行 `npm run build` 检查 TypeScript 编译错误
- **测试失败**: 检查数据库连接和测试数据

#### ❓ 部署问题
- **生产构建**: 确保所有环境变量正确配置
- **数据库迁移**: 使用 `npx prisma migrate deploy` 部署数据库变更
- **日志配置**: 生产环境使用 JSON 格式日志输出

## 📝 开发规范

### 响应格式
- **成功响应**: `{ success: true, data: any, timestamp: string }`
- **错误响应**: `{ code: number, message: string, details?: any, timestamp: string, path: string }`
- **分页响应**: `{ items: T[], page: number, pageSize: number, total: number }`

### 环境配置
- 使用 `@nestjs/config` 管理环境变量
- 支持 `.env`、`.env.development`、`.env.production` 配置
- 使用 Joi 进行配置验证
- 全局配置模块，避免重复导入

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 编写完整的 JSDoc 注释
- 使用装饰器进行参数验证

## 📋 项目脚本总览

### 🚀 开发脚本
| 命令 | 描述 | 用途 |
|------|------|------|
| `npm run start` | 标准启动 | 生产环境启动 |
| `npm run start:dev` | 开发模式 | 热重载开发 |
| `npm run start:debug` | 调试模式 | 断点调试 |
| `npm run start:prod` | 生产启动 | 生产环境运行 |
| `npm run build` | 构建项目 | 编译 TypeScript |

### 🧪 测试脚本
| 命令 | 描述 | 用途 |
|------|------|------|
| `npm test` | 单元测试 | 运行所有测试 |
| `npm run test:watch` | 监听测试 | 文件变化时自动测试 |
| `npm run test:cov` | 覆盖率测试 | 生成测试覆盖率报告 |
| `npm run test:e2e` | E2E 测试 | 端到端集成测试 |

### 🔧 代码质量
| 命令 | 描述 | 用途 |
|------|------|------|
| `npm run format` | 代码格式化 | Prettier 格式化代码 |
| `npm run lint` | 代码检查 | ESLint 检查代码质量 |

### 🗄️ 数据库管理
| 命令 | 描述 | 用途 |
|------|------|------|
| `npm run db:seed` | 种子数据 | 添加示例数据 |
| `npm run db:add-tags` | 批量添加 | 批量添加技术标签 |
| `npm run db:manage` | 交互式管理 | 图形化数据管理 |
| `npm run db:studio` | 数据库可视化 | 打开 Prisma Studio |
| `npm run db:update` | 数据更新 | 运行数据更新脚本 |

## 🎯 学习路径

### 初级 - 基础功能
1. **环境搭建** - 安装依赖、启动项目
2. **API 测试** - 使用 Postman 测试接口
3. **数据管理** - 使用脚本添加、修改数据
4. **文档查看** - 浏览 Swagger API 文档

### 中级 - 开发实践
1. **代码阅读** - 理解 NestJS 模块化架构
2. **功能扩展** - 添加新的业务模块
3. **测试编写** - 编写单元测试和 E2E 测试
4. **数据库操作** - 使用 Prisma 进行数据操作

### 高级 - 架构设计
1. **中间件开发** - 自定义中间件和拦截器
2. **异常处理** - 完善错误处理机制
3. **性能优化** - 数据库查询优化、缓存策略
4. **部署实践** - Docker 容器化、CI/CD 流程

## 🤝 贡献指南

### 开发规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 编写完整的单元测试
- 更新相关文档

### 提交流程
1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 创建 Pull Request

---

**🎉 恭喜！你已经了解了这个完整的 NestJS 全栈项目。现在可以开始你的学习之旅了！**