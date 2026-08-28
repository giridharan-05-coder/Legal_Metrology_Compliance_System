import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

function MasterData() {
  const [rules, setRules] = useState([
    { id: 1, name: 'MRP Declaration', desc: 'Maximum Retail Price must be clearly printed.', keywords: 'MRP, Rs, Price', font: '-', active: true },
    { id: 2, name: 'Net Quantity Font Size', desc: 'Minimum font size based on package area.', keywords: '-', font: '4.0mm', active: true },
    { id: 3, name: 'Manufacturer Details', desc: 'Name and address of the manufacturer.', keywords: 'Manufactured By, Address', font: '-', active: true },
    { id: 4, name: 'Customer Care Details', desc: 'Email and Phone number must be present.', keywords: 'care, email, toll-free', font: '-', active: false }
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="master-data-module"
    >
      <div className="header" style={{ marginBottom: '24px' }}>
        <h1 className="header-title">Master Data Management</h1>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3>Legal Metrology (Packaged Commodities) Rules</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Manage the compliance rules used by the AI Evaluation Engine.</p>
          </div>
          <button className="action-btn">
            <Plus size={20} /> Add New Rule
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Rule Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Keywords</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Min. Font Size</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <motion.tr 
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '20px 16px', fontWeight: 500 }}>{rule.name}</td>
                  <td style={{ padding: '20px 16px', color: 'var(--text-secondary)' }}>{rule.desc}</td>
                  <td style={{ padding: '20px 16px' }}><span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{rule.keywords}</span></td>
                  <td style={{ padding: '20px 16px', fontWeight: 600 }}>{rule.font}</td>
                  <td style={{ padding: '20px 16px' }}>
                    {rule.active ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.9rem' }}><CheckCircle size={16}/> Active</div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}><XCircle size={16}/> Disabled</div>
                    )}
                  </td>
                  <td style={{ padding: '20px 16px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginRight: '16px' }}><Edit2 size={18} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default MasterData;
