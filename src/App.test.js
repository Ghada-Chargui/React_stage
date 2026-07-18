import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from './i18n';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

describe('Confi\'Sit auth experience', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage('fr');
  });

  test('shows a forgot password link on the login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /mot de passe oublié/i })).toBeInTheDocument();
  });

  test('prevents duplicate emails during signup', () => {
    const existingUser = {
      nom: 'Claire',
      email: 'claire@example.com',
      password: 'password123',
      role: 'parent',
    };
    localStorage.setItem('confiSitUsers', JSON.stringify({ [existingUser.email]: existingUser }));

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /je cherche une baby-sitter/i }));
    fireEvent.change(screen.getByLabelText(/nom complet/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: existingUser.email } });
    fireEvent.change(screen.getByLabelText(/^mot de passe$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmation du mot de passe/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '+216 20 000 000' } });
    fireEvent.change(screen.getByLabelText(/quartier/i), { target: { value: 'La Marsa' } });
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    expect(screen.getByText(/cet email est déjà utilisé/i)).toBeInTheDocument();
  });
});
