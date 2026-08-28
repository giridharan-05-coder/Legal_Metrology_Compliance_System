from fastapi import APIRouter

router = APIRouter(prefix="/api/audit", tags=["System Audit and Logging"])

@router.get("/logs")
def get_audit_logs():
    return [
        {"id": 1, "user": "admin", "action": "Updated Legal Rule: MRP Declaration", "timestamp": "2023-10-27T14:30:00Z", "ip": "192.168.1.10"},
        {"id": 2, "user": "john.doe", "action": "Submitted Report INS-8921 (COMPLIANT)", "timestamp": "2023-10-27T10:43:00Z", "ip": "192.168.1.15"},
        {"id": 3, "user": "jane.smith", "action": "Submitted Report INS-8920 (VIOLATION)", "timestamp": "2023-10-27T09:16:00Z", "ip": "192.168.1.22"},
        {"id": 4, "user": "admin", "action": "Added new Inspector: Mike Ross", "timestamp": "2023-10-26T09:00:00Z", "ip": "192.168.1.10"},
        {"id": 5, "user": "mike.ross", "action": "Submitted Report INS-8918 (COMPLIANT)", "timestamp": "2023-10-26T11:21:00Z", "ip": "192.168.1.30"}
    ]
