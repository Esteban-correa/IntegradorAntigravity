import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Register from '../components/Register';

vi.mock('../api/authService', () => ({
  authService: {
    register: vi.fn(() => Promise.resolve({})),
  }
}));

describe('Register Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(getByText(/Nexus CRM - Registro/i)).toBeTruthy();
  });
});
