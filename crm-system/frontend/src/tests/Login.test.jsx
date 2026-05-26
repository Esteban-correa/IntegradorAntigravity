import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Login from '../components/Login';

vi.mock('../api/authService', () => ({
  authService: {
    login: vi.fn(() => Promise.resolve({})),
  }
}));

describe('Login Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(getByText(/Nexus CRM/i)).toBeTruthy();
  });
});
