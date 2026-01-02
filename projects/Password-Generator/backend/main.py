from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pydantic import BaseModel
from generator import generate_password

app = FastAPI(title="Password Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    length: int = 12
    include_upper: bool = True
    include_lower: bool = True
    include_digits: bool = True
    include_special: bool = False

# Mount frontend folder as static files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Serve index.html at root
@app.get("/", response_class=FileResponse)
async def root():
    return FileResponse("../frontend/index.html")

# API endpoint
@app.post("/generate")
async def generate(request: PasswordRequest):
    try:
        if request.length < 4 or request.length > 128:
            raise HTTPException(status_code=400, detail="Length must be 4-128")
        password = generate_password(
            request.length,
            request.include_upper,
            request.include_lower,
            request.include_digits,
            request.include_special
        )
        return {"password": password, "length": request.length}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

