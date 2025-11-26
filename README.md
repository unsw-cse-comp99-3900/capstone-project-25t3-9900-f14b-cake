# JobGenAI-interview WebAPP Installation Manual

## Render.com Deployment

1. After login to render account, go to **Blueprints** tab.
2. Click on the **+ New Blueprint Instance** button on the top right corner.
<img width="1094" height="507" alt="c274a3bb093a1ce95962802b450fd08f" src="https://github.com/user-attachments/assets/ab80b643-9118-4f27-ba20-50e8be3ecab1" />

3. Enter the project Git Repository:  
   `https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-9900-f14b-cake`  
   into the “Public Git Repository” section and click **Continue**.  
   *(Alternatively, use another Git repository deployed by yourself, which is strongly recommended if you wish to extend the use of this webAPP.)*
<img width="940" height="797" alt="d3f16247ea2d2bb40dfc24a79f29a8a4" src="https://github.com/user-attachments/assets/95318871-449a-4636-8595-4abd00fd2e79" />

4. Write a Blueprint name (e.g., `JobGenAI_Interview`) and set the environment config with the following values (copy without quotes):

```
GPT_ACCESS_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_gpt_access"
FAQ_ACCESS_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_faq"
Token_Verify_URL="https://jobgen.ai/version-test/api/1.1/wf/jobgen_token_verify"
TEST_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU"
```
<img width="1687" height="823" alt="fab206ee23d90504598f782f36773c0b" src="https://github.com/user-attachments/assets/5d268c65-4ef0-48f5-a00d-211bc8439b86" />

5. Click **Deploy Blueprint**. Render.com will deploy using the `render.yaml` file and create 3 services.  
   It is recommended to **+ Create new project** to organise these services easily.
<img width="831" height="955" alt="a9452941d2de2b45c6b5a6f779cc811b" src="https://github.com/user-attachments/assets/a667d29c-c678-4ed2-8829-3bd5d18b8e29" />

6. Select the ungrouped services (left-most white boxes) and move them into the newly created project folder.  
   *(You may name the environment as “Production” or any arbitrary name)*
<img width="940" height="793" alt="6700f9a0dc1d17e71adaf22844b8ff91" src="https://github.com/user-attachments/assets/57e0ad9e-48b3-4e72-8a8f-57fa2e2a91c1" />
<img width="943" height="794" alt="acda4f5877d3dbb04aadbd570253bcd6" src="https://github.com/user-attachments/assets/a54b689c-bc6c-412b-94b8-c28e3061bd2c" />

7. Click into the **api (backend)** and **frontend** services and copy the URLs.

Example deployment:  
- Backend URL: `https://interview-api-i4oo.onrender.com`  
- Frontend URL: `https://interview-frontend-kukr.onrender.com`  
*(Your deployment will generate different URLs.)*
<img width="852" height="714" alt="1a4c827cd05c0a4140bbd5ae519269e8" src="https://github.com/user-attachments/assets/13493a68-eb88-4043-aff0-0dce81956b2b" />
<img width="863" height="721" alt="d9a569eec9607b2f4e9786681599dc15" src="https://github.com/user-attachments/assets/64b771f5-a797-45d9-916d-86982bd20a44" />

8. Update the URLs in the environment variables for your own deployment:

### In `interview-api`:
- Go to **Environment** tab → change `FRONTEND_URL` to your frontend URL.
<img width="801" height="725" alt="7f9a9d9ade812bce967357984adb43b2" src="https://github.com/user-attachments/assets/d2f2398b-fbcd-4801-b75f-ce0737646516" />

### In `interview-frontend`:
- Go to **Environment** tab → change `NEXT_PUBLIC_API_URL` to your backend URL.
<img width="823" height="713" alt="ca7c70f50468af2e4fe288f4fa0717ca" src="https://github.com/user-attachments/assets/d662dab3-1c40-4acc-a423-b04e9c9643b9" />

> Note: If you resync the blueprint, you must re-enter these custom values, because the default blueprint uses sample URLs.

**Alternatively:**  
Edit values in your own Git repo's `render.yaml` file:  
Update `Frontend_URL` and `NEXT_PUBLIC_API_URL` accordingly.
<img width="1172" height="1137" alt="8fea0d62a208e2be92056116d3289760" src="https://github.com/user-attachments/assets/edf488c8-eafd-4ec0-8fe3-2c9c15bee6b1" />

9. Access the webapp via your Render-provided frontend URL.
<img width="1106" height="851" alt="16d4c6ef0c9e1644d751fd878c160da5" src="https://github.com/user-attachments/assets/168c81a9-b5d4-41ce-8d6a-e98c51d7c68b" />

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
   <img width="889" height="264" alt="7b3e30ceec89abe87cd88ea3be76f0d3" src="https://github.com/user-attachments/assets/05e3f226-3106-4120-a716-575da985c633" />

4. Start backend via Docker:  
   ```
   python manage_docker.py start
   ```
   <img width="1144" height="1265" alt="ab2d8f1720a835ad19b673e89c597acb" src="https://github.com/user-attachments/assets/48fd1509-b48b-4d2b-a98d-615d067531d6" />

5. Run automated pytest:  
   ```
   python manage_docker.py test
   ```  
   *(Runs 77 backend tests: routes, services, DB.)*
   <img width="1919" height="1529" alt="test" src="https://github.com/user-attachments/assets/1a1dec93-658f-44d5-b8f3-b39b5b4f91c2" />

6. Run integration test:  
   ```
   python manage_docker.py run app/tests/integration.py
   ```
   <img width="1914" height="776" alt="830fdd2db7939f9d1a44d618870194a2" src="https://github.com/user-attachments/assets/5d455fc2-2a21-4cd9-8a4e-4b4107847177" />

## Frontend Deployment

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
