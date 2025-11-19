# app/main.py
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import register_routers

app = FastAPI(title="Interview API", version="1.0.0")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://capstone-project-25t3-9900-f14b-cake.onrender.com",  # Production frontend
        "http://localhost:3000",                                      # Local development
        "http://172.19.0.2:3000",                                     # Docker local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Error Handler ---
@app.exception_handler(Exception)
async def default_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        code = exc.status_code
        message = exc.detail
    else:
        code = status.HTTP_500_INTERNAL_SERVER_ERROR
        message = "Internal Server Error"
    payload = {"code": code, "name": "System Error", "message": message}
    return JSONResponse(status_code=code, content=payload)

# --- Register Routes ---
register_routers(app)

@app.get("/")
def root():
    return {"status": "ok", "message": "Interview API is running"}
