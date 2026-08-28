import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scan, LayoutDashboard, FileText, Database, 
  Settings, User, Bell, CheckCircle, XCircle, TrendingUp, ClipboardList, ShieldCheck
} from 'lucide-react';
import Scanner from './Scanner';
import MasterData from './MasterData';
import Reports from './Reports';
import Analytics from './Analytics';
import Tasks from './Tasks';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total_scans: '--', violations_detected: '--', compliance_rate: '--', active_inspectors: '--', pending_tasks: '--' });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/analytics/dashboard-stats')
      .then(r => r.json()).then(setStats)
      .catch(() => setStats({ total_scans: 1250, violations_detected: 340, compliance_rate: '72.8', active_inspectors: 18, pending_tasks: 7 }));

    fetch('http://localhost:8000/api/reports/')
      .then(r => r.json())
      .then(data => setRecentReports(data.slice(0, 4)))
      .catch(() => setRecentReports([
        { id: 1, report_number: 'INS-8921', product_name: 'Britannia Good Day 250g', is_compliant: true, timestamp: '2023-10-27T10:42:00Z' },
        { id: 2, report_number: 'INS-8920', product_name: 'Dove Shampoo 400ml', is_compliant: false, timestamp: '2023-10-27T09:15:00Z' },
        { id: 3, report_number: 'INS-8919', product_name: 'Aashirvaad Atta 5kg', is_compliant: true, timestamp: '2023-10-26T16:30:00Z' },
        { id: 4, report_number: 'INS-8918', product_name: 'Nescafe Classic 50g', is_compliant: true, timestamp: '2023-10-26T11:20:00Z' }
      ]));
  }, []);

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'scanner', label: 'New Inspection', icon: <Scan size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: 'analytics', label: 'Risk Analytics', icon: <TrendingUp size={20} /> },
    { id: 'tasks', label: 'Field Operations', icon: <ClipboardList size={20} /> },
    { id: 'master_data', label: 'Master Data', icon: <Database size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <ShieldCheck size={30} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>LMC Portal</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Legal Metrology System</div>
          </div>
        </div>

        <nav className="nav-links">
          {nav.map(item => (
            <a key={item.id} href="#" className={"nav-item " + (activeTab === item.id ? 'active' : '')} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin User</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="header" style={{ marginBottom: '32px' }}>
              <div>
                <h1 className="header-title">Overview</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Legal Metrology Compliance Monitor — India</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Bell size={22} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                <button className="action-btn" onClick={() => setActiveTab('scanner')}>
                  <Scan size={18} /> New Inspection
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Total Scans', value: stats.total_scans, color: 'var(--accent)', icon: <Scan size={22} color="var(--accent)" />, sub: 'All time inspections' },
                { label: 'Compliance Rate', value: stats.compliance_rate !== '--' ? stats.compliance_rate + '%' : '--', color: 'var(--success)', icon: <CheckCircle size={22} color="var(--success)" />, sub: '30-day average' },
                { label: 'Violations Detected', value: stats.violations_detected, color: 'var(--danger)', icon: <XCircle size={22} color="var(--danger)" />, sub: 'Needs action' },
                { label: 'Active Inspectors', value: stats.active_inspectors, color: '#f59e0b', icon: <User size={22} color="#f59e0b" />, sub: 'On field today' },
                { label: 'Pending Tasks', value: stats.pending_tasks, color: '#a78bfa', icon: <ClipboardList size={22} color="#a78bfa" />, sub: 'Assigned tasks' }
              ].map((s, i) => (
                <motion.div key={i} className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="stat-header"><h3 style={{ fontSize: '0.9rem' }}>{s.label}</h3>{s.icon}</div>
                  <div className="stat-value" style={{ fontSize: '2.2rem', color: s.color }}>{s.value}</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.sub}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="glass-panel" style={{ padding: '28px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Recent Inspections (Live from API)</h3>
                <button onClick={() => setActiveTab('reports')} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
              </div>
              <div className="scan-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentReports.map((r, i) => (
                  <motion.div key={r.id} className="scan-item glass-panel" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.07 }}>
                    <div className="scan-info">
                      <div className="scan-icon"><FileText size={22} /></div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.product_name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '3px' }}>{r.report_number}</div>
                      </div>
                    </div>
                    <div className={"status-badge " + (r.is_compliant ? 'status-pass' : 'status-fail')}>
                      {r.is_compliant ? 'COMPLIANT' : 'VIOLATION'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'scanner' && <Scanner />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'tasks' && <Tasks />}
        {activeTab === 'master_data' && <MasterData />}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="header" style={{ marginBottom: '32px' }}><h1 className="header-title">Settings</h1></div>
            <div className="glass-panel" style={{ padding: '32px', color: 'var(--text-secondary)' }}>Settings module — coming soon.</div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default App;
