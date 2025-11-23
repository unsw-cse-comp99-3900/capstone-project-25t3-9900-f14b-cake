# AI Interview Coach - Frontend

This is a [Next.js](https://nextjs.org) project for the AI Interview Coach application, containerized with Docker.

## Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Setup

1. Clone the repository and navigate to the frontend directory:

```bash
cd frontend/ai-interview-coach
```

2. Configure Google OAuth Client ID:

   Before setting up environment variables, you need to create a Google OAuth 2.0 Client ID:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client ID**
   - Select **Web application** as the application type
   - In **Authorized JavaScript origins**, add:
     ```
     http://localhost:3000
     ```
   - Click **Create** and copy the generated **Client ID**

3. Create `.env.local` file and configure environment variables:

```bash
touch .env.local
```

Edit `.env.local` and add the following variables:

```bash
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000

# Google OAuth Client ID (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Development Mode

Start the development server with Docker:

```bash
npm run docker:dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

Run the production build:

```bash
npm run docker:prod
```

### Without Docker

If you prefer to run without Docker:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Building

### Using Docker

Build the Docker image:

```bash
npm run docker:build
```

### Without Docker

Build the Next.js application:

```bash
npm run build
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```
