import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Usuarios from '../pages/Usuarios';

vi.mock('../api/usuariosService', () => ({
  usuariosService: {
    getUsuarios: vi.fn(() => Promise.resolve([
      { id: 1, nombre: 'Usuario Test', email: 'test@user.com', rol_id: 1, activo: true }
    ])),
  }
}));

describe('Usuarios Component', () => {
  it('renders loading state then users table', async () => {
    const { getByText } = render(<Usuarios />);
    expect(getByText(/Cargando Usuarios/i)).toBeTruthy();
    await waitFor(() => {
      expect(getByText(/Usuario Test/i)).toBeTruthy();
    });
  });
});
