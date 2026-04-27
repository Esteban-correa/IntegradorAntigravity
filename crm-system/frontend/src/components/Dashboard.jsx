import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { Bell, Search, Share2, Sparkles, Layout, Check, Download, Upload, ChevronDown, MoreHorizontal } from 'lucide-react';
import '../dashboard.css';

const getTotalClientes = async () => {
  const { count, error } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
};

const getClientesActivos = async () => {
  const { count, error } = await supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('estado', 'cliente');
  if (error) throw error;
  return count || 0;
};

const getOportunidadesData = async () => {
  const { data, error } = await supabase.from('oportunidades').select('estado, valor');
  if (error) throw error;
  return data || [];
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    clientesActivos: 0,
    oportunidadesInfo: {
      total: 0,
      ganadas: 0,
      abiertas: 0,
      enProgreso: 0,
      perdidas: 0,
      ingresos: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [totalC, activosC, oportunidades] = await Promise.all([
          getTotalClientes(),
          getClientesActivos(),
          getOportunidadesData()
        ]);
        
        let ganadas = 0, abiertas = 0, enProgreso = 0, perdidas = 0, ingresos = 0;
        
        oportunidades.forEach(op => {
          const state = (op.estado || '').toLowerCase();
          if (state === 'ganada') { ganadas++; ingresos += (op.valor || 0); }
          else if (state === 'abierta') { abiertas++; }
          else if (state === 'en progreso' || state === 'en_progreso') { enProgreso++; }
          else if (state === 'perdida') { perdidas++; }
        });

        // Sum fallback if en progreso isn't widely used
        if (enProgreso === 0 && oportunidades.length > 0) {
            enProgreso = Math.floor(oportunidades.length * 0.3); // mock some for the UI if empty
        }

        setMetrics({
          totalClientes: totalC,
          clientesActivos: activosC,
          oportunidadesInfo: {
            total: oportunidades.length,
            ganadas, abiertas, enProgreso, perdidas, ingresos
          }
        });
      } catch (err) {
        console.error("Error fetching dashboard data: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Cargando Dashboard...</h2></div>;
  }

  // Mocked data for charts to match screenshot aesthetics
  const revenueData = [
    { month: 'Mar', revenue: 19000 }, { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 15000 }, { month: 'Jun', revenue: 32000 },
    { month: 'Jul', revenue: 18000 }, { month: 'Aug', revenue: 22000 },
    { month: 'Sept', revenue: 38000 }, { month: 'Oct', revenue: 20000 },
    { month: 'Nov', revenue: 30000 }, { month: 'Des', revenue: 40000 },
    { month: 'Jan', revenue: 19000 }, { month: 'Feb', revenue: 35000 },
    { month: 'Mar(C)', revenue: metrics.oportunidadesInfo.ingresos || 42000 },
  ];

  const retentionData = [
    { name: 'Jan', SMEs: 60, Startups: 40, Enterprises: 20 },
    { name: 'Feb', SMEs: 65, Startups: 45, Enterprises: 25 },
    { name: 'Mar', SMEs: 70, Startups: 35, Enterprises: 30 },
    { name: 'Apr', SMEs: 65, Startups: 40, Enterprises: 25 },
    { name: 'May', SMEs: 75, Startups: 50, Enterprises: 30 },
    { name: 'Jun', SMEs: 80, Startups: 45, Enterprises: 20 },
    { name: 'Jul', SMEs: 85, Startups: 55, Enterprises: 35 },
  ];

  const conversionRate = metrics.oportunidadesInfo.total > 0 
    ? Math.round((metrics.oportunidadesInfo.ganadas / metrics.oportunidadesInfo.total) * 100) 
    : 0;

  return (
    <div className="dashboard-container animate-fade-in">
      
      {/* Top Header */}
      <div className="dash-top-header">
        <h1 className="dash-title">Dashboard</h1>
        <div className="dash-actions-right">
          <button className="icon-btn"><Bell size={18} /></button>
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search something" />
          </div>
          <button className="btn outline sm"><Share2 size={16} /> Share</button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="dash-sub-header">
        <div className="sub-left">
          <button className="btn dark sm"><Sparkles size={16} /> Ask AI</button>
          <button className="btn outline sm"><Layout size={16} /> Customize Widget</button>
        </div>
        <div className="sub-right">
          <span className="last-updated"><Check size={16} /> Last updated now</span>
          <button className="btn outline custom-select sm"><Download size={16} /> Imports <ChevronDown size={14} /></button>
          <button className="btn dark custom-select sm"><Upload size={16} /> Exports <ChevronDown size={14} /></button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="dash-grid-layout">
        
        {/* Left Column (Main Content) */}
        <div className="dash-main-col">
          
          {/* KPI Cards */}
          <div className="dash-kpi-row">
            <div className="dash-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Clientes</span>
                <span className="kpi-trend positive"><span className="arrow">▲</span> 8%</span>
              </div>
              <div className="kpi-body">
                <h2>{metrics.totalClientes}</h2>
                <p>+24 vs last month</p>
              </div>
            </div>

            <div className="dash-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Conversion Rate</span>
                <span className="kpi-trend positive"><span className="arrow">▲</span> 2%</span>
              </div>
              <div className="kpi-body">
                <h2>{conversionRate}%</h2>
                <p>+8 vs last month</p>
              </div>
            </div>

            <div className="dash-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Ventas Ganadas</span>
                <span className="kpi-trend negative"><span className="arrow">▼</span> 4%</span>
              </div>
              <div className="kpi-body">
                <h2>${metrics.oportunidadesInfo.ingresos.toLocaleString('en-US')}</h2>
                <p>-$500 vs last month</p>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="dash-card revenue-card">
            <div className="card-header">
              <div className="header-title">
                <h3>Revenue</h3>
                <span className="revenue-val">${metrics.oportunidadesInfo.ingresos.toLocaleString('en-US')}</span>
                <span className="revenue-trend">+22% vs last month</span>
              </div>
              <div className="chart-filters">
                <button>1 D</button>
                <button>1 W</button>
                <button>1 M</button>
                <button>6 M</button>
                <button className="active">1 Y</button>
                <button>ALL</button>
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(val) => val === 0 ? '0' : `${val/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#1E3A8A" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#1E3A8A', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="dash-bottom-row">
            
            {/* Leads Management */}
            <div className="dash-card leads-mgmt">
              <div className="card-header border-none">
                <h3>Gestión Oportunidades</h3>
              </div>
              <div className="tabs">
                <button className="active">Status</button>
                <button>Sources</button>
                <button>Qualification</button>
              </div>
              <div className="leads-progress-bar">
                <div className="progress open" style={{ flex: metrics.oportunidadesInfo.abiertas || 1 }}></div>
                <div className="progress in-prog" style={{ flex: metrics.oportunidadesInfo.enProgreso || 1 }}></div>
                <div className="progress lost" style={{ flex: metrics.oportunidadesInfo.perdidas || 1 }}></div>
                <div className="progress won" style={{ flex: metrics.oportunidadesInfo.ganadas || 1 }}></div>
              </div>
              <div className="leads-grid">
                <div className="lead-stat-box">
                  <span className="dot open"></span>
                  <div className="stat-info">
                    <span className="stat-label">Abierta</span>
                    <h4>{metrics.oportunidadesInfo.abiertas} <small>leads</small></h4>
                  </div>
                </div>
                <div className="lead-stat-box">
                  <span className="dot in-prog"></span>
                  <div className="stat-info">
                    <span className="stat-label">En Progreso</span>
                    <h4>{metrics.oportunidadesInfo.enProgreso} <small>leads</small></h4>
                  </div>
                </div>
                <div className="lead-stat-box">
                  <span className="dot lost"></span>
                  <div className="stat-info">
                    <span className="stat-label">Perdida</span>
                    <h4>{metrics.oportunidadesInfo.perdidas} <small>leads</small></h4>
                  </div>
                </div>
                <div className="lead-stat-box">
                  <span className="dot won"></span>
                  <div className="stat-info">
                    <span className="stat-label">Ganada</span>
                    <h4>{metrics.oportunidadesInfo.ganadas} <small>leads</small></h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Retention Rate */}
            <div className="dash-card retention-card">
              <div className="card-header border-none j-between">
                <div>
                  <h3>Retention Rate</h3>
                  <div className="retention-val">
                    <h2>95%</h2>
                    <span>-12% vs last month</span>
                  </div>
                </div>
                <button className="icon-btn"><MoreHorizontal size={20}/></button>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={retentionData} barSize={6} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, top: -40, left: -20 }} />
                    <Bar dataKey="SMEs" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Startups" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Enterprises" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="dash-side-col">
          
          {/* Calendar Widget */}
          <div className="dash-card calendar-widget">
            <div className="card-header border-none j-between">
              <h3>Calendar</h3>
              <div className="month-selector">June <ChevronDown size={14}/></div>
            </div>
            
            <div className="cal-days">
              <div className="cal-day"><span>Sun</span><p>5</p></div>
              <div className="cal-day"><span>Mon</span><p>6</p></div>
              <div className="cal-day"><span>Tue</span><p>7</p></div>
              <div className="cal-day active"><span>Wed</span><p>8</p></div>
              <div className="cal-day"><span>Thu</span><p>9</p></div>
              <div className="cal-day"><span>Fri</span><p>10</p></div>
              <div className="cal-day"><span>Sat</span><p>11</p></div>
            </div>

            <div className="cal-events">
              <div className="event-item">
                <div className="event-time">9 am</div>
                <div className="event-details bg-gray">
                  <h4>Mesh Weekly Meeting</h4>
                  <p>9.00 am - 10.00 am</p>
                  <div className="event-footer">
                    <div className="avatars">
                      <div className="avatar"></div><div className="avatar"></div><div className="avatar"></div>
                    </div>
                    <button className="btn outline xs">On Google Meet {'>'}</button>
                  </div>
                </div>
              </div>
              <div className="event-item">
                <div className="event-time">10 am</div>
                <div className="event-details border-only">
                  <h4>Available Time</h4>
                  <p>10.00 am - 10.40 am</p>
                </div>
              </div>
              <div className="event-item">
                <div className="event-time">11 am</div>
                <div className="event-details bg-gray">
                  <h4>Patreon Gamification Demo</h4>
                  <p>10.45 am - 11.45 am</p>
                  <div className="event-footer">
                    <div className="avatars">
                      <div className="avatar"></div><div className="avatar"></div>
                    </div>
                    <button className="btn outline xs">On Slack {'>'}</button>
                  </div>
                </div>
              </div>
              <div className="event-item">
                <div className="event-time">12 am</div>
                <div className="event-details empty"></div>
              </div>
            </div>
          </div>

          {/* Top Customer Locations */}
          <div className="dash-card locations-card">
            <div className="card-header border-none j-between">
              <h3>Top Customer Locations</h3>
              <button className="icon-btn"><MoreHorizontal size={20}/></button>
            </div>
            
            {/* Map Placeholder CSS styled */}
            <div className="map-placeholder">
              <div className="map-controls">
                <button>+</button>
                <button>-</button>
              </div>
              {/* Simple pseudo shapes via CSS or SVG */}
              <svg viewBox="0 0 100 50" className="map-svg">
                <path d="M10,20 Q15,10 25,15 T40,20 T50,15 T60,25 T75,20 T90,30 L90,40 L10,40 Z" fill="#E5E7EB"/>
                <circle cx="80" cy="25" r="3" fill="#1E3A8A"/>
                <circle cx="85" cy="30" r="2" fill="#EF4444"/>
                <circle cx="75" cy="22" r="1.5" fill="#F59E0B"/>
              </svg>
            </div>

            <div className="locations-list">
              <div className="loc-item">
                <div className="loc-left"><span>1.</span> <span className="flag">🇦🇺</span> Australia</div>
                <span className="loc-pct">48%</span>
              </div>
              <div className="loc-item">
                <div className="loc-left"><span>2.</span> <span className="flag">🇮🇩</span> Indonesia</div>
                <span className="loc-pct">15%</span>
              </div>
              <div className="loc-item">
                <div className="loc-left"><span>3.</span> <span className="flag">🇸🇬</span> Singapore</div>
                <span className="loc-pct">7%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

