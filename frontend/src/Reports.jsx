import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/reports/')
      .then(res => res.json())
      .then(data => { setReports(data); setLoading(false); })
      .catch(() => {
        setReports([
          { id: 1, report_number: 'INS-8921', product_name: 'Britannia Good Day 250g', is_compliant: true, timestamp: '2023-10-27T10:42:00Z', inspector_id: 'John Doe', location: 'Warehouse A' },
          { id: 2, report_number: 'INS-8920', product_name: 'Dove Shampoo 400ml', is_compliant: false, timestamp: '2023-10-27T09:15:00Z', inspector_id: 'Jane Smith', violation_details: 'Font size < 4mm', location: 'Retail Outlet 5' },
          { id: 3, report_number: 'INS-8919', product_name: 'Aashirvaad Atta 5kg', is_compliant: true, timestamp: '2023-10-26T16:30:00Z', inspector_id: 'John Doe', location: 'Warehouse B' },
          { id: 4, report_number: 'INS-8918', product_name: 'Nescafe Classic 50g', is_compliant: true, timestamp: '2023-10-26T11:20:00Z', inspector_id: 'Mike Ross', location: 'Warehouse A' },
          { id: 5, report_number: 'INS-8917', product_name: 'Lays Magic Masala 100g', is_compliant: false, timestamp: '2023-10-25T14:15:00Z', inspector_id: 'Jane Smith', violation_details: 'MRP missing, Manufacturer not found', location: 'Supermart Central' },
        ]);
        setLoading(false);
      });
  }, []);

  const formatDate = (ts) => {
    try { return new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ts; }
  };

  const filtered = reports.filter(r =>
    r.report_number?.toLowerCase().includes(search.toLowerCase()) ||
    r.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.inspector_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-secondary)' }}><RefreshCw size={20} className="spin" />&nbsp;&nbsp;Loading reports...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="header" style={{ marginBottom: '24px' }}>
        <h1 className="header-title">Inspection Reports</h1>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 16px', flex: 1, maxWidth: '420px' }}>
            <Search size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input type="text" placeholder="Search by ID, Product or Inspector..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{filtered.length} records</span>
          <button className="action-btn"><Download size={18} /> Export PDF</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Report ID</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Product Name</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Inspector</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Violation Details</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report, index) => (
                <motion.tr key={report.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '18px 16px', fontWeight: 700, color: 'var(--accent)' }}>{report.report_number}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{formatDate(report.timestamp)}</td>
                  <td style={{ padding: '18px 16px', fontWeight: 500 }}>{report.product_name}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--text-secondary)' }}>{report.inspector_id}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--danger)', fontSize: '0.85rem' }}>{report.violation_details || <span style={{ color: 'var(--success)' }}>None</span>}</td>
                  <td style={{ padding: '18px 16px' }}>
                    <div className={"status-badge " + (report.is_compliant ? 'status-pass' : 'status-fail')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {report.is_compliant ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                      {report.is_compliant ? 'COMPLIANT' : 'VIOLATION'}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>No reports match your search.</div>}
        </div>
      </div>
    </motion.div>
  );
}

export default Reports;
