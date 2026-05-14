import React, { useState, useEffect } from 'react';
import { usuariosService } from '../api/usuariosService';
import { 
  Plus, Search, MoreHorizontal, ChevronLeft, ChevronRight, 
  User, Shield, Mail, CheckCircle, XCircle 
} from 'lucide-react';
import '../users.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Users');

  // Modal State for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol_id: 2,
    activo: true
  });

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await usuariosService.getUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      setErrorMsg("Error cargando usuarios: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentId(user.id);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id,
        activo: user.activo
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ nombre: '', email: '', rol_id: 2, activo: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await usuariosService.updateUsuario(currentId, formData);
      } else {
        await usuariosService.createUsuario(formData);
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleToggleActivo = async (id, currentState) => {
    try {
      await usuariosService.updateUsuario(id, { activo: !currentState });
      fetchUsuarios();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await usuariosService.deleteUsuario(id);
      fetchUsuarios();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (isLoading) return <div className="users-container"><h2>Cargando Usuarios...</h2></div>;

  return (
    <div className="users-container animate-fade-in">
      {/* Top Nav Tabs */}
      <div className="users-top-nav">
        <div className={`top-nav-item ${activeTab === 'All Users' ? 'active' : ''}`} onClick={() => setActiveTab('All Users')}>All Users</div>
        <div className={`top-nav-item ${activeTab === 'Admins' ? 'active' : ''}`} onClick={() => setActiveTab('Admins')}>Admins</div>
        <div className={`top-nav-item ${activeTab === 'Staff' ? 'active' : ''}`} onClick={() => setActiveTab('Staff')}>Staff</div>
        <div className={`top-nav-item ${activeTab === 'Collaborators' ? 'active' : ''}`} onClick={() => setActiveTab('Collaborators')}>Collaborators</div>
      </div>

      {/* Header Section */}
      <div className="users-header">
        <h1>Users</h1>
        <div className="header-actions">
          <button className="btn-orange" onClick={() => handleOpenModal()}>
            <Plus size={18} style={{ marginRight: '8px', display: 'inline' }} /> Create User
          </button>
        </div>
      </div>

      {/* User Card Table */}
      <div className="user-card">
        <div className="card-top">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search user by name or email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Showing <strong>{usuarios.length}</strong> users
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>USER NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th style={{ width: '120px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
              <tr key={user.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="user-name-cell">
                    <div className="user-avatar">{user.nombre.charAt(0)}</div>
                    <div style={{ fontWeight: 600 }}>{user.nombre}</div>
                  </div>
                </td>
                <td style={{ color: '#6B7280' }}>{user.email}</td>
                <td>
                  <span className="role-tag">
                    {user.rol_id === 1 ? 'Admin' : 'Staff'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleActivo(user.id, user.activo)}
                    className={`status-badge ${user.activo ? 'active' : 'inactive'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {user.activo ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleOpenModal(user)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4F46E5', fontSize: '0.875rem', fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(user.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.875rem', fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn"><ChevronLeft size={16} /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700 }}>{isEditing ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  className="ai-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  className="ai-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>Role</label>
                <select 
                   value={formData.rol_id}
                   style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white' }}
                   onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
                >
                  <option value={1}>Administrator</option>
                  <option value={2}>Staff / User</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-orange" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#F97316', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  {isEditing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

