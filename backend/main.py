import os, tempfile
d_temp = r"D:\Legal_Metrology_Compliance_System\backend\temp"
os.makedirs(d_temp, exist_ok=True)
os.environ["TEMP"] = d_temp
os.environ["TMP"] = d_temp
tempfile.tempdir = d_temp

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import scanner, master_data, reports, analytics, tasks, audit
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Legal Metrology Compliance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scanner.router)
app.include_router(master_data.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(tasks.router)
app.include_router(audit.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Legal Metrology Core Backend is running."}

@app.get("/api/auth/me")
def get_me():
    return {"username": "admin", "role": "admin", "full_name": "Admin User"}
