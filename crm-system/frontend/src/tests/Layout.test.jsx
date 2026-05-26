import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Layout from '../components/Layout';

vi.mock('../store/useAuthStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })
}));

vi.mock('../store/useUIStore', () => ({
  useUIStore: () => ({
    sidebarOpen: true,
    toggleSidebar: vi.fn(),
    theme: 'light',
    toggleTheme: vi.fn(),
  })
}));

vi.mock('../api/authService', () => ({
  authService: {
    logout: vi.fn(),
  }
}));

describe('Layout Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(getByText(/Dashboard Overview/i)).toBeTruthy();
  });
});
