import React, { useState, useEffect } from 'react';
import { reportesService } from '../api/reportesService';
import { Download, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reportes() {
  const [data, setData] = useState({
    clientes: [],
    oportunidades: [],
    campanas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg("Error cargando reporte: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const totalClientes = data.clientes.length;
  const clientesActivos = data.clientes.filter(c => c.estado === 'cliente').length;
  const oportunidadesAbiertas = data.oportunidades.filter(o => o.estado === 'abierta').length;
  const ventasGanadas = data.oportunidades
    .filter(o => o.estado === 'ganada')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  // Grouping Clientes por Estado para gráfica
  const clientesPorEstado = data.clientes.reduce((acc, c) => {
    const estado = c.estado || 'desconocido';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});
  const dataPieClientes = Object.keys(clientesPorEstado).map(key => ({
    name: key.toUpperCase(),
    value: clientesPorEstado[key]
  }));

  // Grouping Oportunidades por Estado para gráfica
  const oportunidadesPorEstado = data.oportunidades.reduce((acc, o) => {
    const estado = o.estado || 'desconocido';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});
  const dataBarOportunidades = Object.keys(oportunidadesPorEstado).map(key => ({
    name: key.toUpperCase(),
    cantidad: oportunidadesPorEstado[key]
  }));

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "REPORTES GENERALES\n\n";
    
    // Resumen
    csvContent += "Metrica,Valor\n";
    csvContent += `Total Clientes,${totalClientes}\n`;
    csvContent += `Clientes Activos,${clientesActivos}\n`;
    csvContent += `Oportunidades Abiertas,${oportunidadesAbiertas}\n`;
    csvContent += `Ventas Ganadas,${ventasGanadas}\n\n`;

    // Data detallada (Muestra de Oportunidades)
    csvContent += "OPORTUNIDADES DETALLE\n";
    csvContent += "ID,Titulo,Estado,Valor\n";
    data.oportunidades.forEach(op => {
       const row = `${op.id},"${op.titulo || 'N/A'}","${op.estado || 'N/A'}",${op.valor || 0}`;
       csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_CRM_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Generando reportes...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Centro de Reportes</h2>
        <button onClick={exportToCSV} className="btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--success)' }}>
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      {errorMsg && <div style={{ padding: '16px', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', marginBottom: '24px' }}>{errorMsg}</div>}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Total Clientes Historico</div>
          <div className="kpi-value">{totalClientes.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Clientes Activos</div>
          <div className="kpi-value">{clientesActivos.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Oportunidades Abiertas</div>
          <div className="kpi-value">{oportunidadesAbiertas.toLocaleString()}</div>
        </div>
        <div className="kpi-card" style={{ borderBottom: '4px solid var(--success)' }}>
          <div className="kpi-title">Ventas Ganadas Ponderadas</div>
          <div className="kpi-value">{formatCurrency(ventasGanadas)}</div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="chart-card">
          <h3 className="chart-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChartIcon size={20} color="var(--primary)"/> Dist. Clientes por Estado
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            {dataPieClientes.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dataPieClientes} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {dataPieClientes.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1F2937', color: '#fff', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay datos suficientes</p>}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-header">Volumen de Oportunidades</h3>
          <div style={{ width: '100%', height: 300 }}>
             {dataBarOportunidades.length > 0 ? (
               <ResponsiveContainer>
                 <BarChart data={dataBarOportunidades} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                   <XAxis dataKey="name" stroke="var(--text-muted)" />
                   <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                   <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1F2937', color: '#fff', border: 'none' }} cursor={{fill: 'var(--surface-hover)'}}/>
                   <Bar dataKey="cantidad" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay datos suficientes</p>}
          </div>
        </div>
      </div>
      
      <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
        <h3 style={{ padding: '24px 24px 16px', margin: 0, borderBottom: '1px solid var(--border)' }}>Resumen Directivo Reciente</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '600' }}>Segmento</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Registros Totales</th>
              <th style={{ padding: '16px', fontWeight: '600' }}>Principal Indicador</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px', fontWeight: '500' }}>Clientes</td>
              <td style={{ padding: '16px' }}>{data.clientes.length}</td>
              <td style={{ padding: '16px', color: 'var(--success)' }}>{clientesActivos} Activos</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px', fontWeight: '500' }}>Oportunidades</td>
              <td style={{ padding: '16px' }}>{data.oportunidades.length}</td>
              <td style={{ padding: '16px', color: 'var(--primary)' }}>{oportunidadesAbiertas} Abiertas</td>
            </tr>
            <tr>
              <td style={{ padding: '16px', fontWeight: '500' }}>Campañas</td>
              <td style={{ padding: '16px' }}>{data.campanas.length}</td>
              <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Métricas pendientes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
