import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, MapPin, User, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assigned_to: '', location: '', priority: 'medium', due_date: '' });

  const fetchTasks = () => {
    fetch('/api/tasks/')
      .then(res => res.json())
      .then(data => { setTasks(data); setLoading(false); })
      .catch(() => {
        setTasks([
          { id: 1, title: 'Inspect Spice Warehouse A', assigned_to: 'John Doe', location: 'Warehouse A, Sector 5', priority: 'high', status: 'pending', due_date: '2023-10-29' },
          { id: 2, title: 'Audit Retail Outlet Central Mall', assigned_to: 'Jane Smith', location: 'Central Mall, MG Road', priority: 'medium', status: 'in_progress', due_date: '2023-10-28' },
          { id: 3, title: 'Cosmetics Import Check - Port', assigned_to: 'Mike Ross', location: 'JNPT, Mumbai Port', priority: 'high', status: 'pending', due_date: '2023-10-30' },
          { id: 4, title: 'Health Supplement Stores Survey', assigned_to: 'John Doe', location: 'Andheri West Zone', priority: 'low', status: 'completed', due_date: '2023-10-26' }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchTasks(); }, []);

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'var(--danger)';
    if (priority === 'medium') return '#f59e0b';
    return 'var(--success)';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={18} color="var(--success)" />;
    if (status === 'in_progress') return <Clock size={18} color="#f59e0b" />;
    return <AlertCircle size={18} color="var(--danger)" />;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/tasks/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask) })
      .then(res => res.json())
      .then(() => { fetchTasks(); setShowForm(false); setNewTask({ title: '', assigned_to: '', location: '', priority: 'medium', due_date: '' }); })
      .catch(() => { setShowForm(false); });
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-secondary)' }}>Loading tasks...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="header" style={{ marginBottom: '32px' }}>
        <h1 className="header-title">Field Operations</h1>
        <button className="action-btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Assign New Task
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Assign New Inspection Task</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Task Title</label>
              <input type="text" required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }} placeholder="e.g. Inspect Warehouse B" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Assign To</label>
              <input type="text" required value={newTask.assigned_to} onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }} placeholder="Inspector name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Location</label>
              <input type="text" required value={newTask.location} onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }} placeholder="Location or address" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Priority</label>
              <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                style={{ background: '#1e293b', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Due Date</label>
              <input type="date" required value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <button type="submit" className="action-btn" style={{ flex: 1, justifyContent: 'center' }}>Assign Task</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.map((task, idx) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)', flexShrink: 0 }}>
              <ClipboardList size={28} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{task.title}</span>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: getPriorityColor(task.priority) + '22', color: getPriorityColor(task.priority), border: '1px solid ' + getPriorityColor(task.priority) + '55', textTransform: 'uppercase' }}>{task.priority}</span>
              </div>
              <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {task.assigned_to}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {task.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Due: {task.due_date}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {getStatusIcon(task.status)}
              <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{task.status.replace('_', ' ')}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Tasks;
