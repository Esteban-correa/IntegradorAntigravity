import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Campanas from '../pages/Campanas';

vi.mock('../api/campanasService', () => ({
  campanasService: {
    getCampanas: vi.fn(() => Promise.resolve([
      { id: 1, nombre: 'Campaña Test', descripcion: 'Desc', fecha_inicio: '2026-05-01', fecha_fin: '2026-05-30', presupuesto: 5000 }
    ])),
  }
}));

describe('Campanas Component', () => {
  it('renders loading state then campaign table', async () => {
    const { getByText } = render(<Campanas />);
    expect(getByText(/Cargando Campañas/i)).toBeTruthy();
    await waitFor(() => {
      expect(getByText(/Campaña Test/i)).toBeTruthy();
    });
  });
});
