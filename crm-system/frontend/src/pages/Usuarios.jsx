import React, { useState, useEffect } from 'react';
import { usuariosService } from '../api/usuariosService';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol_id: 2, // asumiendo 1 Admin, 2 Usuario
    activo: true
  });
  const [formError, setFormError] = useState('');

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
    setFormError('');
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

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setFormError("Por favor ingresa un email válido.");
      return;
    }

    try {
      if (isEditing) {
        await usuariosService.updateUsuario(currentId, formData);
      } else {
        await usuariosService.createUsuario(formData);
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (err) {
      setFormError("Error guardando usario: " + err.message);
    }
  };

  const handleToggleActivo = async (id, currentState) => {
    try {
      await usuariosService.updateUsuario(id, { activo: !currentState });
      fetchUsuarios();
    } catch (err) {
      setErrorMsg("Error cambiando estado: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await usuariosService.deleteUsuario(id);
      fetchUsuarios();
    } catch (err) {
      setErrorMsg("Error eliminando usuario: " + err.message);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Cargando usuarios...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gestión de Usuarios</h2>
        <button className="btn" onClick={() => handleOpenModal()} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Crear Usuario
        </button>
      </div>

      {errorMsg && <div style={{ padding: '16px', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', marginBottom: '24px' }}>{errorMsg}</div>}

      <div className="kpi-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600' }}>Nombre</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Rol</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Estado</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
               <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay usuarios registrados.</td></tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>{user.nombre}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-color)', fontSize: '0.875rem' }}>
                      {user.roles?.nombre || `Rol ${user.rol_id}`}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleToggleActivo(user.id, user.activo)}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        backgroundColor: user.activo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: user.activo ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-button" onClick={() => handleOpenModal(user)} aria-label="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button className="icon-button" onClick={() => handleDelete(user.id)} style={{ color: 'var(--danger)' }} aria-label="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="auth-card" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <button className="icon-button" onClick={handleCloseModal} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
            
            {formError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.875rem' }}>{formError}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Rol Interno (ID)</label>
                <input 
                  type="number" 
                  value={formData.rol_id} 
                  onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value) || 2})}
                  required 
                  min="1"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={formData.activo} 
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  style={{ width: 'auto' }}
                />
                <label style={{ marginBottom: 0 }}>Usuario Activo</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn" onClick={handleCloseModal} style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  {isEditing ? 'Guardar Cambios' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
