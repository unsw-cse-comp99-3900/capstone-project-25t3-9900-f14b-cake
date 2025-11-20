# Use lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /usr/src/app

# Disable pyc cache & enable instant log output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Let Python recognize the top-level package
ENV PYTHONPATH=/usr/src/app

# Install system libraries required by psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
 && rm -rf /var/lib/apt/lists/*

# Copy dependency file and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire app code to container
COPY ./app ./app

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI service with database initialization
CMD python -m app.db.db_init && \
    python -m app.db.init_badges && \
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}