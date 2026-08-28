import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, BarChart2, Activity } from 'lucide-react';

function Analytics() {
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/risk-heatmap')
      .then(res => res.json())
      .then(data => { setHeatmap(data); setLoading(false); })
      .catch(() => {
        setHeatmap({
          high_risk_categories: [
            { category: 'Imported Cosmetics', violation_rate: 68, total_scans: 112 },
            { category: 'Packaged Spices', violation_rate: 52, total_scans: 245 },
            { category: 'Health Supplements', violation_rate: 45, total_scans: 180 },
            { category: 'Bakery Products', violation_rate: 28, total_scans: 310 },
            { category: 'Beverages', violation_rate: 19, total_scans: 420 }
          ],
          monthly_trend: [
            { month: 'Apr', compliant: 68, violations: 32 },
            { month: 'May', compliant: 72, violations: 28 },
            { month: 'Jun', compliant: 65, violations: 35 },
            { month: 'Jul', compliant: 70, violations: 30 },
            { month: 'Aug', compliant: 73, violations: 27 }
          ]
        });
        setLoading(false);
      });
  }, []);

  const getRiskColor = (rate) => {
    if (rate >= 60) return 'var(--danger)';
    if (rate >= 40) return '#f59e0b';
    return 'var(--success)';
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading analytics data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="header" style={{ marginBottom: '32px' }}>
        <h1 className="header-title">Predictive Risk Analytics</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Risk Heatmap */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <h3>High Risk Categories</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {heatmap.high_risk_categories.map((cat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{cat.category}</span>
                  <span style={{ color: getRiskColor(cat.violation_rate), fontWeight: 700 }}>{cat.violation_rate}% violation rate</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: cat.violation_rate + '%' }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    style={{ height: '100%', background: getRiskColor(cat.violation_rate), borderRadius: '20px' }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{cat.total_scans} total scans</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Monthly Compliance Trend */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <Activity size={24} color="var(--accent)" />
            <h3>Monthly Compliance Trend</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {heatmap.monthly_trend.map((month, idx) => (
              <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <span style={{ width: '36px', fontWeight: 600, color: 'var(--text-secondary)' }}>{month.month}</span>
                <div style={{ flex: 1, display: 'flex', gap: '4px', height: '32px', alignItems: 'center' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: month.compliant + '%' }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    style={{ height: '100%', background: 'var(--success)', borderRadius: '4px 0 0 4px', opacity: 0.8 }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: month.violations + '%' }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    style={{ height: '100%', background: 'var(--danger)', borderRadius: '0 4px 4px 0', opacity: 0.8 }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '80px', textAlign: 'right' }}>
                  <span style={{ color: 'var(--success)' }}>{month.compliant}%</span> / <span style={{ color: 'var(--danger)' }}>{month.violations}%</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--success)' }}></div><span style={{ fontSize: '0.85rem' }}>Compliant</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--danger)' }}></div><span style={{ fontSize: '0.85rem' }}>Violation</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Analytics;
