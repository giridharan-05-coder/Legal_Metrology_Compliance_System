# Legal Metrology Compliance System

An AI-powered inspection and legal metrology compliance monitoring platform for packaged commodity labels in India (under Legal Metrology Packaged Commodities Rules, 2011).

## Features
- **Multi-Angle AI Scanning**: Automatic orientation detection (0, 90, 180, 270 deg) and text extraction using EasyOCR.
- **Mandatory Declaration Verification**:
  - Maximum Retail Price (MRP) & Unit Sale Price
  - Net Quantity / Weight (with dot-matrix font correction)
  - Manufacture / Packing Date (MFD/PKD) & Use By Date (UBD/EXP)
  - Batch / Lot Number
  - Manufacturer / Packer / Brand details
  - Consumer Care Contact (phone & email)
  - FSSAI License Number
- **Inspection Reporting & Persistence**: SQLite-backed audit trails and reporting.
- **Modern Responsive Dashboard**: Built with React, Vite, CSS variables, and Framer Motion.

## Project Structure
`
Legal_Metrology_Compliance_System/
├── backend/
│   ├── routers/
│   │   ├── scanner.py       # OCR & declaration parsing engine
│   │   ├── reports.py       # Report creation & retrieval
│   │   ├── master_data.py   # Legal rules & guidelines
│   │   ├── analytics.py     # Compliance risk statistics
│   │   ├── tasks.py         # Field inspection tasks
│   │   └── audit.py         # Audit logs
│   ├── database.py          # SQLite database connection
│   ├── models.py            # SQLAlchemy schema models
│   ├── main.py              # FastAPI main application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── Scanner.jsx      # Live scan interface & manual controls
│   │   ├── Reports.jsx      # Inspection records table
│   │   ├── Analytics.jsx    # Risk analytics charts
│   │   ├── MasterData.jsx   # Rules master data
│   │   ├── Tasks.jsx        # Operations & assignment
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
`

## Getting Started

### Backend Setup
`ash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
`

### Frontend Setup
`ash
cd frontend
npm install
npm run dev
`
