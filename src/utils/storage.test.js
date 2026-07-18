import { persistUserAccount, getStoredUsers } from './storage';

describe('storage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('persistUserAccount makes babysitter accounts visible to the admin list', () => {
    const account = {
      email: 'mira@example.com',
      name: 'Mira',
      role: 'babysitter',
      phone: '+216 50 000 000',
      photo: 'data:image/png;base64,abc',
      hourlyRate: 42,
      experience: 6,
      zone: 'Carthage',
      availability: ['Matin', 'Soirée'],
      languages: ['Français', 'Arabe'],
      bio: 'Disponible le week-end',
    };

    persistUserAccount(account, { persistSession: false });

    const storedUsers = getStoredUsers();
    expect(storedUsers[account.email]).toMatchObject({
      role: 'babysitter',
      hourlyRate: 42,
      experience: 6,
      zone: 'Carthage',
      photo: 'data:image/png;base64,abc',
      languages: ['Français', 'Arabe'],
      availability: ['Matin', 'Soirée'],
      bio: 'Disponible le week-end',
    });

    const adminUsers = JSON.parse(localStorage.getItem('confiSitAdminUsers') || '[]');
    expect(adminUsers.find((item) => item.email === account.email)).toMatchObject({
      role: 'babysitter',
      zone: 'Carthage',
      hourlyRate: 42,
      experience: 6,
    });
  });
});
