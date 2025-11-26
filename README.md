# JobGenAI-interview WebAPP Installation Manual

## Render.com Deployment

1. After login to render account, go to **Blueprints** tab.
2. Click on the **+ New Blueprint Instance** button on the top right corner.
3. Enter the project Git Repository:  
   `https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-9900-f14b-cake`  
   into the “Public Git Repository” section and click **Continue**.  
   *(Alternatively, use another Git repository deployed by yourself, which is strongly recommended if you wish to extend the use of this webAPP.)*

4. Write a Blueprint name (e.g., `JobGenAI_Interview`) and set the environment config with the following values (copy without quotes):

```
GPT_ACCESS_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_gpt_access"
FAQ_ACCESS_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_faq"
Token_Verify_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_token_verify"
TEST_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"
```

5. Click **Deploy Blueprint**. Render.com will deploy using the `render.yaml` file and create 3 services.  
   It is recommended to **+ Create new project** to organise these services easily.

6. Select the ungrouped services (left-most white boxes) and move them into the newly created project folder.  
   *(You may name the environment “Production”, but it’s optional.)*

7. Click into the **api (backend)** and **frontend** services and copy the URLs.

Example deployment:  
- Backend URL: `https://interview-api-i4oo.onrender.com`  
- Frontend URL: `https://interview-frontend-kukr.onrender.com`  
*(Your deployment will generate different URLs.)*

8. Update the URLs in the environment variables for your own deployment:

### In `interview-api`:
- Go to **Environment** tab → change `FRONTEND_URL` to your frontend URL.

### In `interview-frontend`:
- Go to **Environment** tab → change `NEXT_PUBLIC_API_URL` to your backend URL.

> Note: If you resync the blueprint, you must re-enter these custom values, because the default blueprint uses sample URLs.

**Alternatively:**  
Edit values in your own Git repo's `render.yaml` file:  
Update `Frontend_URL` and `NEXT_PUBLIC_API_URL` accordingly.

9. Access the webapp via your Render-provided frontend URL.

---

## Local Docker Deployment

Ensure **Docker Desktop** is running and **Python** is available on your machine.

### Backend Deployment

1. Ensure `.env` exists in the `/backend` folder  
   *(Not included in GitHub repo)*.
2. Navigate to backend folder:  
   ```
   cd backend
   ```
3. List available commands:  
   ```
   python manage_docker.py -h
   ```
4. Start backend via Docker:  
   ```
   python manage_docker.py start
   ```
5. Run automated pytest:  
   ```
   python manage_docker.py test
   ```  
   *(Runs 77 backend tests: routes, services, DB.)*
6. Run integration test:  
   ```
   python manage_docker.py run app/tests/integration.py
   ```

## Frontend Deployment

Full reference:  
https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-9900-f14b-cake/tree/main/frontend/ai-interview-coach

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