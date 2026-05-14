import React, { useState, useEffect } from 'react';
import { reportesService } from '../api/reportesService';
import { 
  Users, DollarSign, Briefcase, Plus, Search, MoreHorizontal, 
  ChevronRight, Calendar, Sparkles, MessageSquare, Zap, Clock, Send 
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import '../reports.css';

export default function Reportes() {
  const [data, setData] = useState({
    clientes: [],
    oportunidades: [],
    campanas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Priority');

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const [clientes, oportunidades, campanas] = await Promise.all([
        reportesService.getClientes(),
        reportesService.getOportunidades(),
        reportesService.getCampanas()
      ]);
      setData({ clientes, oportunidades, campanas });
    } catch (err) {
      console.error("Error cargando reporte:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const totalClientes = data.clientes.length;
  const totalRevenue = data.oportunidades
    .filter(o => o.estado === 'ganada')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const totalProjects = data.campanas.length;

  // Mock comparison values for UI aesthetics
  const clientComp = 10;
  const revenueComp = 3720;
  const projectComp = 16;

  // Mock data for the "Revenue Analytics" dot plot
  const chartData = [
    { x: 1, y: 50, z: 10, type: 'actual' },
    { x: 2, y: 80, z: 12, type: 'actual' },
    { x: 3, y: 60, z: 8, type: 'actual' },
    { x: 4, y: 120, z: 15, type: 'actual' },
    { x: 5, y: 100, z: 10, type: 'actual' },
    { x: 6, y: 180, z: 20, type: 'actual' },
    { x: 7, y: 150, z: 15, type: 'actual' },
    { x: 8, y: 220, z: 25, type: 'projected' }, // Highlighted point
    { x: 9, y: 130, z: 12, type: 'actual' },
    { x: 10, y: 90, z: 10, type: 'actual' },
    { x: 11, y: 160, z: 18, type: 'actual' },
    { x: 12, y: 240, z: 22, type: 'actual' },
  ];

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  if (isLoading) return <div className="reports-container"><h2>Generando Reportes LoopAI...</h2></div>;

  return (
    <div className="reports-container animate-fade-in">
      {/* Top Navigation */}
      <div className="reports-nav">
        <div className="nav-pill">Overview</div>
        <div className="nav-pill">Clients</div>
        <div className="nav-pill">Projects</div>
        <div className="nav-pill">Inbox</div>
        <div className="nav-pill active">Analytics</div>
        <div style={{ marginLeft: 'auto' }}>
          <div className="client-avatar">
             <Plus size={16} />
          </div>
        </div>
      </div>

      <div className="reports-main-grid">
        {/* Main Content Column */}
        <div className="main-content-col">
          
          {/* KPI Row */}
          <div className="kpi-row">
            <div className="report-kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Clients</span>
                <span className="kpi-badge plus">+4</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-main-val">{totalClientes}</span>
                <span className="kpi-subtext">Compare {clientComp} (last month)</span>
              </div>
            </div>

            <div className="report-kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Revenue</span>
                <span className="kpi-badge minus">-8%</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-main-val">${totalRevenue.toLocaleString()}</span>
                <span className="kpi-subtext">{formatCurrency(revenueComp)} (last month)</span>
              </div>
            </div>

            <div className="report-kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Projects</span>
                <span className="kpi-badge plus">+6</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-main-val">{totalProjects}</span>
                <span className="kpi-subtext">Compare {projectComp} (last month)</span>
              </div>
            </div>
          </div>

          {/* Revenue Analytics Chart */}
          <div className="report-section-card">
            <div className="section-header">
              <h3 className="section-title">Revenue Analytics</h3>
              <div className="chart-legend">
                <div className="legend-item"><span className="dot" style={{background: '#10B981'}}></span> Actual</div>
                <div className="legend-item"><span className="dot" style={{background: '#E5E7EB'}}></span> AI Projected</div>
              </div>
              <div className="chart-controls">
                <select className="control-select"><option>Earnings</option></select>
                <select className="control-select"><option>Last 30 Days</option></select>
                <button className="icon-btn" style={{border: 'none', background: 'none'}}><Search size={16}/></button>
              </div>
            </div>
            
            <div style={{ width: '100%', height: 300, display: 'flex', gap: '20px' }}>
              <div style={{ width: '180px', fontSize: '0.8rem', color: '#6B7280', paddingTop: '20px' }}>
                 <div style={{ background: '#F3F4F6', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                    Better client communication can boost tips and repeat work. Try faster responses!
                 </div>
                 <button className="btn" style={{ background: 'linear-gradient(90deg, #6366F1 0%, #A5B4FC 100%)', color: 'white', borderRadius: '20px', fontSize: '0.75rem' }}>
                    Run Analysis
                 </button>
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" name="day" hide />
                    <YAxis type="number" dataKey="y" name="revenue" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Actual" data={chartData}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.x === 8 ? '#6366F1' : '#10B981'} fillOpacity={entry.x === 8 ? 1 : 0.4} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Manage Projects Table */}
          <div className="report-section-card">
            <div className="section-header">
              <h3 className="section-title">Manage Projects</h3>
              <button className="icon-btn" style={{border: 'none', background: 'none'}}><Search size={18}/></button>
            </div>
            
            <div className="project-tabs">
              <button className={`tab-btn ${activeTab === 'Priority' ? 'active' : ''}`} onClick={() => setActiveTab('Priority')}>
                Priority <span className="tab-count">3</span>
              </button>
              <button className="tab-btn">Active <span className="tab-count">4</span></button>
              <button className="tab-btn">Completed</button>
              <button className="tab-btn">Canceled</button>
              <button className="tab-btn">Recommended <span className="tab-count">3</span></button>
            </div>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Task</th>
                  <th>Note</th>
                  <th>Duo on</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>More</th>
                </tr>
              </thead>
              <tbody>
                {data.oportunidades.slice(0, 3).map((op, idx) => (
                  <tr key={op.id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">{op.cliente_id ? 'C' : 'OP'}</div>
                        <div>
                          <div style={{fontWeight: 600}}>Client Name {idx + 1}</div>
                          <div style={{fontSize: '0.7rem', color: '#9CA3AF'}}>@client.{idx}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{fontWeight: 600}}>{op.titulo}</div>
                      <div style={{fontSize: '0.7rem', color: '#9CA3AF'}}>General Project Detail</div>
                    </td>
                    <td><Zap size={16} color="#E5E7EB"/></td>
                    <td>Apr {idx + 1}</td>
                    <td style={{fontWeight: 600}}>${op.valor}</td>
                    <td>
                      <span className={`status-tag ${op.estado === 'ganada' ? 'review' : 'progress'}`}>
                        {op.estado === 'ganada' ? 'Done' : 'In Progress'}
                      </span>
                    </td>
                    <td><MoreHorizontal size={18} color="#9CA3AF"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="sidebar-col">
          <div className="sidebar-section">
            
            <div className="priority-tasks">
              <div className="section-header" style={{marginBottom: '16px'}}>
                <h3 className="section-title">Priority tasks</h3>
                <span style={{fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600}}>See all</span>
              </div>
              
              <div className="task-item">
                <div className="task-icon-container"></div>
                <div className="task-content">
                  <h4>Follow-ups</h4>
                  <div className="task-meta">
                    <span><Calendar size={12}/> Apr 1</span>
                    <span><Zap size={12}/> 3/4 completed</span>
                  </div>
                </div>
                <ChevronRight size={18} style={{marginLeft: 'auto', color: '#E5E7EB'}}/>
              </div>

              <div className="task-item">
                <div className="task-icon-container"></div>
                <div className="task-content">
                  <h4>Contract Review</h4>
                  <div className="task-meta">
                    <span><Calendar size={12}/> Apr 1</span>
                    <span><Zap size={12}/> 1/2 completed</span>
                  </div>
                </div>
                <ChevronRight size={18} style={{marginLeft: 'auto', color: '#E5E7EB'}}/>
              </div>

              <div className="task-item">
                <div className="task-icon-container"></div>
                <div className="task-content">
                  <h4>Invoices</h4>
                  <div className="task-meta">
                    <span><Calendar size={12}/> Apr 2</span>
                    <span><Zap size={12}/> 1/5 paid</span>
                  </div>
                </div>
                <ChevronRight size={18} style={{marginLeft: 'auto', color: '#E5E7EB'}}/>
              </div>
            </div>

            <div className="ai-help-card">
               <div className="ai-header">
                 <div style={{fontSize: '0.75rem', color: '#6B7280'}}>Hi, Adam 👋</div>
                 <h3>How can I help you?</h3>
               </div>

               <div className="ai-options-grid">
                  <div className="ai-option-btn">
                    <MessageSquare size={16} color="#10B981"/>
                    <span>Text Assistance</span>
                  </div>
                  <div className="ai-option-btn">
                    <Zap size={16} color="#F59E0B"/>
                    <span>Process Automation</span>
                  </div>
                  <div className="ai-option-btn">
                    <Clock size={16} color="#6366F1"/>
                    <span>Schedule Optimization</span>
                  </div>
                  <div className="ai-option-btn">
                    <Zap size={16} color="#EC4899"/>
                    <span>Smart Response</span>
                  </div>
               </div>

               <div className="ai-input-wrapper">
                 <input type="text" className="ai-input" placeholder="Ask something..." />
                 <Send size={18} style={{position: 'absolute', right: 12, top: 12, color: '#9CA3AF'}} />
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

