import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ParentSearchPage from './ParentSearchPage';

describe('ParentSearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loads babysitters from localStorage and shows the dynamic zone filter', () => {
    const sitterFromStorage = {
      id: 'new-sitter',
      name: 'Mona',
      location: 'Carthage',
      rate: 40,
      experience: 4,
      availability: ['Matin', 'Soirée'],
      languages: ['Français', 'Arabe'],
      specialties: ['Garde régulière'],
      rating: 4.7,
      reviews: [],
      bio: 'Disponible toute la semaine.',
      image: 'https://example.com/avatar.jpg',
      services: ['Garde ponctuelle'],
      role: 'babysitter',
      email: 'mona@example.com',
    };

    localStorage.setItem('confiSitUsers', JSON.stringify({ [sitterFromStorage.email]: sitterFromStorage }));

    render(
      <MemoryRouter>
        <ParentSearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mona/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Carthage' })).toBeInTheDocument();
  });
});
