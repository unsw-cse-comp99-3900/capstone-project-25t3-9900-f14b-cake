# Docker 使用指南

这个项目已经配置好了Docker支持，你可以使用Docker来运行这个Next.js应用。

## 快速开始

### 开发环境
```bash
# 启动开发环境（热重载）
npm run docker:dev

# 或者直接使用docker-compose
docker-compose --profile dev up --build
```

### 生产环境
```bash
# 启动生产环境
npm run docker:prod

# 或者直接使用docker-compose
docker-compose --profile prod up --build
```

### 构建镜像
```bash
# 只构建镜像，不启动服务
npm run docker:build

# 或者直接使用docker-compose
docker-compose --profile build up --build
```

### 停止服务
```bash
# 停止所有Docker服务
npm run docker:down

# 或者直接使用docker-compose
docker-compose down
```

## 访问应用

- 开发环境：http://localhost:3000
- 生产环境：http://localhost:3000

## Docker 配置说明

### Dockerfile
- 使用多阶段构建优化镜像大小
- 基于Node.js 18 Alpine镜像
- 支持开发和生产环境

### docker-compose.yml
- `app-dev`: 开发环境，支持热重载
- `app-prod`: 生产环境，优化性能
- `app-build`: 仅构建镜像

### .dockerignore
- 排除不必要的文件，减少构建上下文大小
- 包含node_modules、构建输出等

## 环境变量

你可以在docker-compose.yml中设置环境变量，或者创建.env文件：

```bash
# .env
NODE_ENV=development
PORT=3000
```

## 故障排除

### 端口冲突
如果3000端口被占用，可以修改docker-compose.yml中的端口映射：
```yaml
ports:
  - "3001:3000"  # 将本地3001端口映射到容器3000端口
```

### 权限问题
如果遇到权限问题，可以尝试：
```bash
sudo docker-compose up --build
```

### 清理Docker资源
```bash
# 清理未使用的镜像
docker image prune

# 清理所有未使用的资源
docker system prune

# 清理所有资源（包括正在使用的）
docker system prune -a
```
