import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Reportes from '../pages/Reportes';

vi.mock('../api/reportesService', () => ({
  reportesService: {
    getClientes: vi.fn(() => Promise.resolve([])),
    getOportunidades: vi.fn(() => Promise.resolve([])),
    getCampanas: vi.fn(() => Promise.resolve([])),
  }
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  ScatterChart: ({ children }) => <div>{children}</div>,
  Scatter: () => <div />,
  XAxis: () => null,
  YAxis: () => null,
  ZAxis: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

describe('Reportes Component', () => {
  it('renders loading state then report analytics', async () => {
    const { getByText } = render(<Reportes />);
    expect(getByText(/Generando Reportes LoopAI/i)).toBeTruthy();
    await waitFor(() => {
      expect(getByText(/Revenue Analytics/i)).toBeTruthy();
    });
  });
});
