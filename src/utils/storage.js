import { sitters as fallbackSitters } from '../data/mockSitters';

const USERS_STORAGE_KEY = 'confiSitUsers';
const CURRENT_USER_STORAGE_KEY = 'confiSitUser';
const ADMIN_USERS_STORAGE_KEY = 'confiSitAdminUsers';
const STORAGE_CHANGE_EVENT = 'confiSitDataChanged';

const parseJson = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const emitStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
  }
};

export const normalizeRole = (role) => {
  if (role === 'baby-sitter' || role === 'babysitter') {
    return 'babysitter';
  }
  if (role === 'admin') {
    return 'admin';
  }
  return 'parent';
};

export const getStoredUsers = () => parseJson(USERS_STORAGE_KEY, {});

export const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  const adminUsers = Object.values(users).map((user) => normalizeAccount(user));
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsers));
  emitStorageChange();
};

export const getStoredCurrentUser = () => {
  const currentUser = parseJson(CURRENT_USER_STORAGE_KEY, null);
  return currentUser && typeof currentUser === 'object' ? currentUser : null;
};

export const saveStoredCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    emitStorageChange();
    return;
  }

  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  emitStorageChange();
};

export const normalizeAccount = (account = {}) => {
  const role = normalizeRole(account.role);
  const availability = Array.isArray(account.availability)
    ? account.availability
    : typeof account.availability === 'string'
      ? account.availability.split(',').map((item) => item.trim()).filter(Boolean)
      : ['Matin'];

  return {
    id: account.id || account.email || `user-${Math.random().toString(36).slice(2, 8)}`,
    name: account.name || account.nom || 'Utilisateur',
    nom: account.nom || account.name || 'Utilisateur',
    email: account.email || '',
    role,
    status: account.status || 'Actif',
    phone: account.phone || '',
    address: account.address || account.quartier || '',
    quartier: account.quartier || account.address || '',
    childrenCount: account.childrenCount || 1,
    bio: account.bio || '',
    hourlyRate: account.hourlyRate || 35,
    zone: account.zone || account.address || account.quartier || 'Tunis',
    availability,
    experience: account.experience || 3,
    photo: account.photo || '',
    password: account.password || '',
    languages: Array.isArray(account.languages) ? account.languages : (account.language ? [account.language] : []),
    specialties: Array.isArray(account.specialties) ? account.specialties : [],
    rating: account.rating || 4.7,
    reviews: Array.isArray(account.reviews) ? account.reviews : [],
    services: Array.isArray(account.services) ? account.services : ['Garde ponctuelle'],
    registeredAt: account.registeredAt || new Date().toISOString().slice(0, 10),
    notes: account.notes || '',
  };
};

export const persistUserAccount = (account, options = {}) => {
  const normalizedAccount = normalizeAccount(account);
  const users = getStoredUsers();

  if (normalizedAccount.email) {
    users[normalizedAccount.email] = normalizedAccount;
    saveStoredUsers(users);
  }

  if (options.persistSession !== false) {
    saveStoredCurrentUser(normalizedAccount);
  }

  return normalizedAccount;
};

export const getRegisteredUsers = () => {
  const users = getStoredUsers();
  return Object.values(users).map((user) => normalizeAccount(user));
};

export const saveRegisteredUsers = (users) => {
  const nextRegistry = users.reduce((registry, user) => {
    const normalizedUser = normalizeAccount(user);
    if (normalizedUser.email) {
      registry[normalizedUser.email] = normalizedUser;
    }
    return registry;
  }, {});
  saveStoredUsers(nextRegistry);
  return nextRegistry;
};

export const getBabysitterProfiles = () => {
  const users = getStoredUsers();
  const babysitters = Object.values(users).filter((user) => normalizeRole(user.role) === 'babysitter');

  if (babysitters.length > 0) {
    return babysitters.map((user) => ({
      id: user.email.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || `sitter-${user.name}`,
      name: user.name || user.nom || 'Babysitter',
      location: user.location || user.zone || user.address || user.quartier || 'Tunis',
      rate: Number(user.hourlyRate) || 35,
      experience: Number(user.experience) || 3,
      availability: Array.isArray(user.availability) ? user.availability : [user.availability || 'Matin'],
      languages: user.languages || ['Français', 'Arabe'],
      specialties: user.specialties || ['Garde attentive'],
      rating: Number(user.rating) || 4.7,
      reviews: Array.isArray(user.reviews) ? user.reviews : [],
      bio: user.bio || 'Babysitter disponible pour les familles.',
      image: user.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      services: user.services || ['Garde ponctuelle'],
      email: user.email,
      role: 'babysitter',
      phone: user.phone || '',
      address: user.address || user.quartier || '',
      zone: user.zone || user.address || user.quartier || 'Tunis',
    }));
  }

  const fallbackProfiles = fallbackSitters.map((sitter) => ({ ...sitter }));
  const seededUsers = Object.fromEntries(fallbackProfiles.map((sitter) => [sitter.email || `${sitter.id}@demo.local`, {
    email: sitter.email || `${sitter.id}@demo.local`,
    name: sitter.name,
    nom: sitter.name,
    role: 'babysitter',
    zone: sitter.location,
    address: sitter.location,
    quartier: sitter.location,
    hourlyRate: sitter.rate,
    availability: sitter.availability,
    experience: sitter.experience,
    bio: sitter.bio,
    photo: sitter.image,
    languages: sitter.languages,
    specialties: sitter.specialties,
    rating: sitter.rating,
    reviews: sitter.reviews,
    services: sitter.services,
  }]));
  saveStoredUsers(seededUsers);
  return fallbackProfiles;
};

export const STORAGE_CHANGE_EVENT_NAME = STORAGE_CHANGE_EVENT;

const CHILDREN_STORAGE_KEY = 'confiSitChildren';

export const getChildrenForParent = (parentEmail) => {
  if (!parentEmail) return [];
  const all = parseJson(CHILDREN_STORAGE_KEY, {});
  return Array.isArray(all[parentEmail]) ? all[parentEmail] : [];
};

export const saveChildrenForParent = (parentEmail, children) => {
  if (!parentEmail) return;
  const all = parseJson(CHILDREN_STORAGE_KEY, {});
  all[parentEmail] = children;
  localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(all));
  emitStorageChange();
};

export const addBabysitterReview = (sitterEmail, review) => {
  if (!sitterEmail) return null;
  const users = getStoredUsers();
  const sitter = users[sitterEmail];
  if (!sitter) return null;

  const nextReviews = Array.isArray(sitter.reviews) ? [...sitter.reviews, review] : [review];
  const ratingValues = nextReviews.map((item) => Number(item.stars) || 0).filter((value) => value > 0);
  const nextRating = ratingValues.length
    ? Number((ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length).toFixed(1))
    : sitter.rating;

  users[sitterEmail] = { ...sitter, reviews: nextReviews, rating: nextRating };
  saveStoredUsers(users);
  return users[sitterEmail];
};

const FAVORITES_STORAGE_KEY = 'confiSitFavorites';

export const getFavoriteSitterIds = (parentEmail) => {
  if (!parentEmail) return [];
  const all = parseJson(FAVORITES_STORAGE_KEY, {});
  return Array.isArray(all[parentEmail]) ? all[parentEmail] : [];
};

export const toggleFavoriteSitter = (parentEmail, sitterId) => {
  if (!parentEmail || !sitterId) return [];
  const all = parseJson(FAVORITES_STORAGE_KEY, {});
  const current = Array.isArray(all[parentEmail]) ? all[parentEmail] : [];
  const next = current.includes(sitterId) ? current.filter((id) => id !== sitterId) : [...current, sitterId];
  all[parentEmail] = next;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(all));
  emitStorageChange();
  return next;
};

const RESERVATIONS_STORAGE_KEY = 'confiSitReservations';
const LEGACY_RESERVATIONS_STORAGE_KEY = 'confiSitParentReservations';

export const getReservations = () => {
  const stored = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      localStorage.removeItem(RESERVATIONS_STORAGE_KEY);
    }
  }

  // Migration ponctuelle depuis l'ancienne clé (liste propre au parent, non partagée avec la babysitter)
  const legacy = localStorage.getItem(LEGACY_RESERVATIONS_STORAGE_KEY);
  if (legacy) {
    try {
      const parsedLegacy = JSON.parse(legacy);
      if (Array.isArray(parsedLegacy)) {
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(parsedLegacy));
        return parsedLegacy;
      }
    } catch {
      // ignore malformed legacy data
    }
  }

  return [];
};

export const saveReservations = (reservations) => {
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  emitStorageChange();
};