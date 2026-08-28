from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import Optional
import datetime

router = APIRouter(prefix="/api/tasks", tags=["Field Operations and Tasking"])

class TaskCreate(BaseModel):
    title: str
    assigned_to: str
    location: str
    priority: str
    due_date: str

@router.get("/")
def get_tasks():
    return [
        {"id": 1, "title": "Inspect Spice Warehouse A", "assigned_to": "John Doe", "location": "Warehouse A, Sector 5", "priority": "high", "status": "pending", "due_date": "2023-10-29"},
        {"id": 2, "title": "Audit Retail Outlet Central Mall", "assigned_to": "Jane Smith", "location": "Central Mall, MG Road", "priority": "medium", "status": "in_progress", "due_date": "2023-10-28"},
        {"id": 3, "title": "Cosmetics Import Check - Port", "assigned_to": "Mike Ross", "location": "JNPT, Mumbai Port", "priority": "high", "status": "pending", "due_date": "2023-10-30"},
        {"id": 4, "title": "Health Supplement Stores Survey", "assigned_to": "John Doe", "location": "Andheri West Zone", "priority": "low", "status": "completed", "due_date": "2023-10-26"}
    ]

@router.post("/")
def create_task(task: TaskCreate):
    return {"status": "success", "message": f"Task '{task.title}' assigned to {task.assigned_to}.", "id": 5}
