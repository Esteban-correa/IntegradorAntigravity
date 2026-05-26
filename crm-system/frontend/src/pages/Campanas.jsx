import React, { useState, useEffect } from 'react';
import { campanasService } from '../api/campanasService';
import { 
  Search, Calendar, ChevronDown, 
  ChevronLeft, ChevronRight, Columns 
} from 'lucide-react';
import '../campaigns.css';

export default function Campanas() {
  const [campanas, setCampanas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State for CRUD
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

  const fetchCampanas = async () => {
    try {
      setIsLoading(true);
      const data = await campanasService.getCampanas();
      setCampanas(data || []);
    } catch (err) {
      console.error("Error cargando campañas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanas();
  }, []);

  const handleOpenModal = (campana = null) => {
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
      setFormData({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', presupuesto: 0 });
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
        await campanasService.updateCampana(currentId, formData);
      } else {
        await campanasService.createCampana(formData);
      }
      handleCloseModal();
      fetchCampanas();
    } catch (err) {
      console.error("Error saving campaign:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta campaña?")) return;
    try {
      await campanasService.deleteCampana(id);
      fetchCampanas();
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replaceAll(',', '.'); // Match screenshot dot separator $10.000
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) return <div className="campaigns-container"><h2>Cargando Campañas...</h2></div>;

  return (
    <div className="campaigns-container animate-fade-in">
      {/* Top Nav Tabs */}
      <div className="campaigns-top-nav">
        <div className="top-nav-item">Ads</div>
        <div className="top-nav-item">Email</div>
        <div className="top-nav-item">Social Media</div>
        <div className="top-nav-item">Website</div>
        <div className="top-nav-item active">Campaign</div>
        <div className="top-nav-item">Lead Capture</div>
      </div>

      {/* Header Section */}
      <div className="campaigns-header">
        <h1>Campaign</h1>
        <div className="header-actions">
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Columns size={18} /> Manage Column
          </button>
          <button className="btn-orange" onClick={() => handleOpenModal()}>
            Create Campaign
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="campaigns-filters">
        <div className="filter-group">
          <div className="filter-dropdown">
            <Calendar size={16} /> Date created <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
             Campaign owner <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
             Budget range <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Campaign Card */}
      <div className="campaign-card">
        <div className="card-top">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search campaign" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="showing-info">
            Showing <select style={{ border: 'none', background: 'none', fontWeight: 600 }}><option>7</option></select> of {campanas.length} results
          </div>
        </div>

        <table className="campaign-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>CAMPAIGN NAME <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }}/></th>
              <th>OWNER <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }}/></th>
              <th>GOALS <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }}/></th>
              <th>BUDGET <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }}/></th>
              <th>DATE CREATED <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }}/></th>
              <th style={{ width: '100px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {campanas.map((campana) => (
              <tr key={campana.id}>
                <td><input type="checkbox" /></td>
                <td style={{ fontWeight: 600 }}>{campana.nombre}</td>
                <td>
                  <div className="owner-cell">
                    <div className="owner-avatar"></div>
                    <span>Darlene Robertson</span> {/* Mocked Owner */}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>$100.000 {/* Mocked Goal */}</td>
                <td style={{ fontWeight: 500 }}>${formatCurrency(campana.presupuesto)}</td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} color="#9CA3AF" />
                    {formatDate(campana.fecha_inicio)}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenModal(campana)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4F46E5' }}>Edit</button>
                    <button onClick={() => handleDelete(campana.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn disabled"><ChevronLeft size={16} /></button>
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
          <div className="report-section-card" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '32px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '24px' }}>{isEditing ? 'Editar Campaña' : 'Nueva Campaña'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="nombre" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Nombre</label>
                <input 
                  id="nombre"
                  type="text" 
                  value={formData.nombre} 
                  className="ai-input"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="presupuesto" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Presupuesto</label>
                <input 
                  id="presupuesto"
                  type="number" 
                  value={formData.presupuesto} 
                  className="ai-input"
                  onChange={(e) => setFormData({...formData, presupuesto: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="fecha_inicio" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Fecha Inicio</label>
                <input 
                  id="fecha_inicio"
                  type="date" 
                  value={formData.fecha_inicio} 
                  className="ai-input"
                  onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={handleCloseModal} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-orange">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


