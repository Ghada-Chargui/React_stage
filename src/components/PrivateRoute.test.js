import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RedirectIfAuth from './RedirectIfAuth';

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects unauthenticated users to the login page', () => {
    render(
      <MemoryRouter initialEntries={['/espace-parent']}>
        <Routes>
          <Route path="/connexion" element={<div>Connexion</div>} />
          <Route
            path="/espace-parent"
            element={
              <PrivateRoute requiredRole="parent">
                <div>Tableau de bord</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  test('redirects authenticated admins to the admin area from auth pages', () => {
    localStorage.setItem('confiSitUser', JSON.stringify({ role: 'admin', name: 'Admin' }));

    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<RedirectIfAuth><div>Connexion</div></RedirectIfAuth>} />
          <Route path="/espace-admin" element={<div>Espace admin</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Espace admin')).toBeInTheDocument();
  });

  test('redirects authenticated parents to their member space from auth pages', () => {
    localStorage.setItem('confiSitUser', JSON.stringify({ role: 'parent', name: 'Amel' }));

    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<RedirectIfAuth><div>Connexion</div></RedirectIfAuth>} />
          <Route path="/espace-parent" element={<div>Espace parent</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Espace parent')).toBeInTheDocument();
  });
});
