export const ADMIN_USERS_STORAGE_KEY = 'confiSitAdminUsers';
export const ADMIN_COMPLAINTS_STORAGE_KEY = 'confiSitAdminComplaints';

const createDefaultUsers = () => [
  {
    id: 'user-1',
    name: 'Sonia Ben Ali',
    email: 'sonia@example.com',
    role: 'parent',
    registeredAt: '2025-01-14',
    status: 'Actif',
    phone: '+216 20 100 111',
    address: 'La Marsa',
    childrenCount: 2,
    notes: 'Parent très régulier',
  },
  {
    id: 'user-2',
    name: 'Mouna Kefi',
    email: 'mouna@example.com',
    role: 'babysitter',
    registeredAt: '2024-12-03',
    status: 'Actif',
    phone: '+216 21 295 004',
    address: 'Carthage',
    hourlyRate: 35,
    experience: 5,
    zone: 'Carthage',
    availability: ['Matin', 'Soir'],
    bio: 'Baby-sitter expérimentée avec formation premiers secours.',
  },
  {
    id: 'user-3',
    name: 'Hedi Zarrouk',
    email: 'hedi@example.com',
    role: 'parent',
    registeredAt: '2025-03-21',
    status: 'En attente',
    phone: '+216 22 330 710',
    address: 'Sidi Bou Said',
    childrenCount: 1,
    notes: 'Nouveau compte à valider',
  },
  {
    id: 'user-4',
    name: 'Lina Trabelsi',
    email: 'lina@example.com',
    role: 'babysitter',
    registeredAt: '2025-02-16',
    status: 'Suspendu',
    phone: '+216 98 774 112',
    address: 'Ariana',
    hourlyRate: 28,
    experience: 2,
    zone: 'Ariana',
    availability: ['Après-midi'],
    bio: 'Disponible en semaine uniquement.',
  },
];

const createDefaultComplaints = () => [
  {
    id: 'complaint-1',
    userName: 'Sonia Ben Ali',
    subject: 'Retard de paiement',
    message: 'La réservation du 14 juillet n’a pas encore été réglée.',
    date: '2026-07-10',
    status: 'En attente',
    note: 'Suivi à prévoir avec l’équipe finance.',
  },
  {
    id: 'complaint-2',
    userName: 'Mouna Kefi',
    subject: 'Comportement du parent',
    message: 'Le parent a demandé un changement de dernière minute.',
    date: '2026-07-08',
    status: 'Traité',
    note: 'Alerte envoyée au support client.',
  },
  {
    id: 'complaint-3',
    userName: 'Hedi Zarrouk',
    subject: 'Profil incomplet',
    message: 'Le profil ne contient pas toutes les informations attendues.',
    date: '2026-07-12',
    status: 'En attente',
    note: '',
  },
];

const ensureDefaultRegistry = () => {
  if (typeof window === 'undefined') return;

  const registry = localStorage.getItem('confiSitUsers');
  const parsedRegistry = registry ? JSON.parse(registry) : {};
  const nextRegistry = {
    ...parsedRegistry,
    'admin@confisit.com': {
      ...(parsedRegistry['admin@confisit.com'] || {}),
      nom: 'Admin ConfiSit',
      email: 'admin@confisit.com',
      password: 'admin123',
      role: 'admin',
    },
    'parent@confisit.com': {
      ...(parsedRegistry['parent@confisit.com'] || {}),
      nom: 'Parent Demo',
      email: 'parent@confisit.com',
      password: 'parent123',
      role: 'parent',
    },
    'sitter@confisit.com': {
      ...(parsedRegistry['sitter@confisit.com'] || {}),
      nom: 'Babysitter Demo',
      email: 'sitter@confisit.com',
      password: 'sitter123',
      role: 'babysitter',
    },
  };

  localStorage.setItem('confiSitUsers', JSON.stringify(nextRegistry));
};

export const initializeAdminDemoData = () => {
  if (typeof window === 'undefined') return;

  ensureDefaultRegistry();

  if (!localStorage.getItem(ADMIN_USERS_STORAGE_KEY)) {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(createDefaultUsers()));
  }

  if (!localStorage.getItem(ADMIN_COMPLAINTS_STORAGE_KEY)) {
    localStorage.setItem(ADMIN_COMPLAINTS_STORAGE_KEY, JSON.stringify(createDefaultComplaints()));
  }
};

export const getAdminUsers = () => {
  initializeAdminDemoData();
  const stored = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAdminUsers = (users) => {
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  return users;
};

export const getAdminComplaints = () => {
  initializeAdminDemoData();
  const stored = localStorage.getItem(ADMIN_COMPLAINTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAdminComplaints = (complaints) => {
  localStorage.setItem(ADMIN_COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  return complaints;
};
