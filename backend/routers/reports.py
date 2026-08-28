from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from typing import Optional
import models
import uuid
import datetime

router = APIRouter(prefix="/api/reports", tags=["Inspection Reporting"])

class ReportCreate(BaseModel):
    product_name: str
    is_compliant: bool
    extracted_data_json: str
    violation_details: Optional[str] = None
    inspector_id: Optional[str] = "admin_1"

@router.post("/")
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    report_num = "INS-" + str(uuid.uuid4())[:8].upper()
    new_report = models.InspectionReport(
        report_number=report_num,
        inspector_id=payload.inspector_id or "admin_1",
        product_name=payload.product_name,
        is_compliant=payload.is_compliant,
        extracted_data_json=payload.extracted_data_json,
        violation_details=payload.violation_details
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"status": "success", "report_number": new_report.report_number, "id": new_report.id}

@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(models.InspectionReport).order_by(models.InspectionReport.timestamp.desc()).all()
    if not reports:
        return [
            {"id": 1, "report_number": "INS-8921", "product_name": "Britannia Good Day 250g", "is_compliant": True, "timestamp": "2023-10-27T10:42:00Z", "inspector_id": "admin_1"},
            {"id": 2, "report_number": "INS-8920", "product_name": "Dove Shampoo 400ml", "is_compliant": False, "timestamp": "2023-10-27T09:15:00Z", "inspector_id": "admin_1", "violation_details": "Font size < 4mm"},
            {"id": 3, "report_number": "INS-8919", "product_name": "Aashirvaad Atta 5kg", "is_compliant": True, "timestamp": "2023-10-26T16:30:00Z", "inspector_id": "admin_2"}
        ]
    return reports
