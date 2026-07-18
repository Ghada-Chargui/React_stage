import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

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
});
