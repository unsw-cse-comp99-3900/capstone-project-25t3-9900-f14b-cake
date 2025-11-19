# 使用轻量级 Python 镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /usr/src/app

# 禁用 pyc 缓存 & 启用即时日志输出
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 让 Python 识别到顶层包
ENV PYTHONPATH=/usr/src/app


# 安装 psycopg2 所需系统库
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
 && rm -rf /var/lib/apt/lists/*

# 复制依赖文件并安装
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 复制整个 app 代码到容器
COPY ./app ./app

# 暴露 FastAPI 端口
EXPOSE 8000

# 启动 FastAPI 服务
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
