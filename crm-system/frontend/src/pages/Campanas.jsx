import React, { useState, useEffect } from 'react';
import { campanasService } from '../api/campanasService';
import { Edit2, Trash2, Plus, X, Calendar } from 'lucide-react';

export default function Campanas() {
  const [campanas, setCampanas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: 0
  });
  const [formError, setFormError] = useState('');

  const fetchCampanas = async () => {
    try {
      setIsLoading(true);
      const data = await campanasService.getCampanas();
      setCampanas(data || []);
    } catch (err) {
      setErrorMsg("Error cargando campañas: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanas();
  }, []);

  const handleOpenModal = (campana = null) => {
    setFormError('');
    if (campana) {
      setIsEditing(true);
      setCurrentId(campana.id);
      setFormData({
        nombre: campana.nombre,
        descripcion: campana.descripcion || '',
        fecha_inicio: campana.fecha_inicio ? campana.fecha_inicio.substring(0, 10) : '',
        fecha_fin: campana.fecha_fin ? campana.fecha_fin.substring(0, 10) : '',
        presupuesto: campana.presupuesto || 0
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ 
        nombre: '', 
        descripcion: '', 
        fecha_inicio: '', 
        fecha_fin: '', 
        presupuesto: 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setFormError("El nombre de la campaña es obligatorio.");
      return;
    }
    if (formData.presupuesto < 0) {
      setFormError("El presupuesto no puede ser negativo.");
      return;
    }

    try {
      if (isEditing) {
        await campanasService.updateCampana(currentId, formData);
      } else {
        await campanasService.createCampana(formData);
      }
      handleCloseModal();
      fetchCampanas();
    } catch (err) {
      setFormError("Error guardando campaña: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta campaña?")) return;
    try {
      await campanasService.deleteCampana(id);
      fetchCampanas();
    } catch (err) {
      setErrorMsg("Error eliminando campaña: " + err.message);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Cargando campañas...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gestión de Campañas</h2>
        <button className="btn" onClick={() => handleOpenModal()} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Crear Campaña
        </button>
      </div>

      {errorMsg && <div style={{ padding: '16px', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', marginBottom: '24px' }}>{errorMsg}</div>}

      <div className="kpi-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600' }}>Nombre</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Descripción</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Duración</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Presupuesto</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campanas.length === 0 ? (
               <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay campañas registradas.</td></tr>
            ) : (
              campanas.map((campana) => (
                <tr key={campana.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{campana.nombre}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {campana.descripcion || '-'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {campana.fecha_inicio ? new Date(campana.fecha_inicio).toLocaleDateString() : 'N/A'} - {campana.fecha_fin ? new Date(campana.fecha_fin).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: 'var(--success)' }}>
                    {formatCurrency(campana.presupuesto)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-button" onClick={() => handleOpenModal(campana)} aria-label="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button className="icon-button" onClick={() => handleDelete(campana.id)} style={{ color: 'var(--danger)' }} aria-label="Eliminar">
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
          <div className="auth-card" style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <button className="icon-button" onClick={handleCloseModal} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>{isEditing ? 'Editar Campaña' : 'Nueva Campaña'}</h3>
            
            {formError && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.875rem' }}>{formError}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la Campaña *</label>
                <input 
                  type="text" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej. Promoción Verano 2026"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', resize: 'vertical' }}
                  placeholder="Detalles sobre esta campaña..."
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input 
                    type="date" 
                    value={formData.fecha_inicio} 
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input 
                    type="date" 
                    value={formData.fecha_fin} 
                    onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Presupuesto ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.presupuesto} 
                  onChange={(e) => setFormData({...formData, presupuesto: parseFloat(e.target.value) || 0})}
                  required 
                />
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
