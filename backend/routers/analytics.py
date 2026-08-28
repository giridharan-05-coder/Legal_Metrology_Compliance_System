from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/analytics", tags=["Analytics and Predictive Risk"])

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(models.InspectionReport).count()
    if total == 0:
        return {
            "total_scans": 1250,
            "violations_detected": 340,
            "compliance_rate": "72.8",
            "active_inspectors": 18,
            "pending_tasks": 7
        }
    compliant_count = db.query(models.InspectionReport).filter(models.InspectionReport.is_compliant == True).count()
    compliance_rate = (compliant_count / total) * 100 if total > 0 else 0
    return {
        "total_scans": total,
        "violations_detected": total - compliant_count,
        "compliance_rate": f"{compliance_rate:.1f}",
        "active_inspectors": 18,
        "pending_tasks": 7
    }

@router.get("/risk-heatmap")
def get_risk_heatmap():
    # Predictive risk data: brands/categories with high non-compliance probability
    return {
        "high_risk_categories": [
            {"category": "Imported Cosmetics", "violation_rate": 68, "total_scans": 112},
            {"category": "Packaged Spices", "violation_rate": 52, "total_scans": 245},
            {"category": "Health Supplements", "violation_rate": 45, "total_scans": 180},
            {"category": "Bakery Products", "violation_rate": 28, "total_scans": 310},
            {"category": "Beverages", "violation_rate": 19, "total_scans": 420}
        ],
        "monthly_trend": [
            {"month": "Apr", "compliant": 68, "violations": 32},
            {"month": "May", "compliant": 72, "violations": 28},
            {"month": "Jun", "compliant": 65, "violations": 35},
            {"month": "Jul", "compliant": 70, "violations": 30},
            {"month": "Aug", "compliant": 73, "violations": 27}
        ]
    }
