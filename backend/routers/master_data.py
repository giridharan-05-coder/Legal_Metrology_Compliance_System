from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/master-data", tags=["Master Data Management"])

@router.get("/rules")
def get_all_rules(db: Session = Depends(get_db)):
    rules = db.query(models.LegalRule).all()
    if not rules:
        # Seed default rules if empty
        default_rules = [
            models.LegalRule(rule_name="MRP Declaration", description="Maximum Retail Price must be clearly printed.", required_keywords="MRP, Rs, Price"),
            models.LegalRule(rule_name="Net Quantity Font Size", description="Minimum font size for Net Quantity based on package area.", min_font_size_mm=4.0),
            models.LegalRule(rule_name="Manufacturer Details", description="Name and address of the manufacturer must be present.", required_keywords="Manufactured By, Address")
        ]
        db.add_all(default_rules)
        db.commit()
        rules = db.query(models.LegalRule).all()
    
    return rules
