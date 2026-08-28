from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from database import Base
import datetime

class LegalRule(Base):
    __tablename__ = "legal_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String, index=True)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    min_font_size_mm = Column(Float, nullable=True)
    required_keywords = Column(String, nullable=True) # comma separated

class InspectionReport(Base):
    __tablename__ = "inspection_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String, unique=True, index=True)
    inspector_id = Column(String)
    product_name = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_compliant = Column(Boolean)
    extracted_data_json = Column(String) # Store JSON string of extracted details
    violation_details = Column(String, nullable=True)
