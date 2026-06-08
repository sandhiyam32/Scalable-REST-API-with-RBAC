import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { title: '', description: '', status: 'todo', priority: 'medium' };

export default function TasksPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    taskService.list()
      .then(r => setTasks(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => { setEditTask(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority }); setFormError(''); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editTask) await taskService.update(editTask.id, form);
      else await taskService.create(form);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      const data = err.response?.data?.errors || {};
      setFormError(Object.values(data).flat().join(' ') || 'Something went wrong.');
    }
  };

  const handleDelete = async () => {
    await taskService.remove(deleteId);
    setDeleteId(null);
    fetchTasks();
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h2 style={{ margin: 0, color: '#1a1a2e' }}>📋 Task Dashboard</h2>
        <div style={s.headerRight}>
          <span style={s.roleBadge}>{user?.role?.toUpperCase()}</span>
          <span style={s.username}>👤 {user?.username}</span>
          {isAdmin && <button style={s.createBtn} onClick={openCreate}>+ New Task</button>}
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <p style={s.center}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={s.center}>No tasks yet. {isAdmin && 'Click "+ New Task" to create one.'}</p>
      ) : (
        <div style={s.grid}>
          {tasks.map(task => (
            <div key={task.id} style={s.card}>
              <div style={s.cardTop}>
                <strong style={s.taskTitle}>{task.title}</strong>
                <span style={{ ...s.badge, ...priorityStyle(task.priority) }}>{task.priority}</span>
              </div>
              <p style={s.desc}>{task.description || '—'}</p>
              <div style={s.cardBottom}>
                <span style={{ ...s.badge, ...statusStyle(task.status) }}>{task.status.replace('_', ' ')}</span>
                <span style={s.meta}>by {task.created_by}</span>
              </div>
              {isAdmin && (
                <div style={s.actions}>
                  <button style={s.editBtn} onClick={() => openEdit(task)}>✏️ Edit</button>
                  <button style={s.deleteBtn} onClick={() => setDeleteId(task.id)}>🗑️ Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom: '1rem' }}>{editTask ? 'Edit Task' : 'Create Task'}</h3>
            {formError && <p style={s.error}>{formError}</p>}
            <form onSubmit={handleSave}>
              <input style={s.input} placeholder="Title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }} placeholder="Description"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select style={s.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select style={s.input} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={s.saveBtn}>{editTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: '340px', textAlign: 'center' }}>
            <h3>Delete Task?</h3>
            <p style={{ color: '#666', margin: '0.5rem 0 1.5rem' }}>This action cannot be undone.</p>
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ ...s.saveBtn, background: '#ff4d4f' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const priorityStyle = (p) => ({
  background: p === 'high' ? '#fff1f0' : p === 'medium' ? '#fff7e6' : '#f6ffed',
  color: p === 'high' ? '#cf1322' : p === 'medium' ? '#d46b08' : '#389e0d',
});
const statusStyle = (s) => ({
  background: s === 'done' ? '#f6ffed' : s === 'in_progress' ? '#e6f7ff' : '#f5f5f5',
  color: s === 'done' ? '#389e0d' : s === 'in_progress' ? '#096dd9' : '#595959',
});

const s = {
  page: { maxWidth: '960px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  roleBadge: { background: '#1890ff', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 },
  username: { fontSize: '14px', color: '#333' },
  createBtn: { padding: '8px 16px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  logoutBtn: { padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' },
  card: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' },
  taskTitle: { fontSize: '15px', color: '#1a1a2e', flex: 1, marginRight: '0.5rem' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' },
  desc: { fontSize: '13px', color: '#888', margin: '0.25rem 0', lineHeight: 1.4 },
  meta: { fontSize: '11px', color: '#bbb' },
  actions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' },
  editBtn: { flex: 1, padding: '5px', background: '#e6f7ff', color: '#096dd9', border: '1px solid #91d5ff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { flex: 1, padding: '5px', background: '#fff1f0', color: '#cf1322', border: '1px solid #ffa39e', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '10px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  input: { width: '100%', padding: '0.7rem', marginBottom: '0.85rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' },
  cancelBtn: { padding: '8px 20px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  saveBtn: { padding: '8px 20px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  error: { color: '#ff4d4f', background: '#fff1f0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px' },
  center: { textAlign: 'center', color: '#999', marginTop: '4rem', fontSize: '15px' },
};
