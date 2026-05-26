import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Dashboard from '../components/Dashboard';

vi.mock('../api/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ count: 10, data: [], error: null })),
      })),
    })),
  }
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div />,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
}));

describe('Dashboard Component', () => {
  it('renders loading state initially and dashboard content', async () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText(/Cargando Dashboard/i)).toBeTruthy();
    await waitFor(() => {
      expect(getByText(/Conversion Rate/i)).toBeTruthy();
    });
  });
});
