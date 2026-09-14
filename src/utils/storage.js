import { sitters as fallbackSitters } from '../data/mockSitters';

const USERS_STORAGE_KEY = 'confiSitUsers';
const CURRENT_USER_STORAGE_KEY = 'confiSitUser';
const ADMIN_USERS_STORAGE_KEY = 'confiSitAdminUsers';
const STORAGE_CHANGE_EVENT = 'confiSitDataChanged';
const DEFAULT_SITTER_IMAGE =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80';

const normalizePhoto = (photo) => {
  const value = typeof photo === 'string' ? photo.trim() : '';

  if (
    value.startsWith('data:image/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/')
  ) {
    return value;
  }

  return DEFAULT_SITTER_IMAGE;
};

const parseJson = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return parsed && typeof parsed === 'object'
      ? parsed
      : fallback;
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

/*
 * ============================================================
 * NORMALISATION DU ROLE
 * ============================================================
 */

export const normalizeRole = (role) => {
  if (!role) {
    return 'parent';
  }

  const normalizedRole = String(role)
    .trim()
    .toLowerCase();

  if (
    normalizedRole === 'babysitter' ||
    normalizedRole === 'baby-sitter' ||
    normalizedRole === 'baby_sitter'
  ) {
    return 'babysitter';
  }

  if (normalizedRole === 'admin') {
    return 'admin';
  }

  if (normalizedRole === 'parent') {
    return 'parent';
  }

  return 'parent';
};

/*
 * ============================================================
 * UTILISATEURS
 * ============================================================
 */

export const getStoredUsers = () => {
  return parseJson(USERS_STORAGE_KEY, {});
};

export const saveStoredUsers = (users) => {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users)
  );

  const adminUsers = Object.values(users).map((user) => {
    const normalizedUser = normalizeAccount(user);

    return normalizedUser.photo.startsWith('data:image/')
      ? { ...normalizedUser, photo: '' }
      : normalizedUser;
  });

  try {
    localStorage.setItem(
      ADMIN_USERS_STORAGE_KEY,
      JSON.stringify(adminUsers)
    );
  } catch (error) {
    if (error.name !== 'QuotaExceededError') {
      throw error;
    }

    localStorage.removeItem(ADMIN_USERS_STORAGE_KEY);
  }

  emitStorageChange();
};

export const getStoredCurrentUser = () => {
  const currentUser = parseJson(
    CURRENT_USER_STORAGE_KEY,
    null
  );

  return currentUser && typeof currentUser === 'object'
    ? currentUser
    : null;
};

export const saveStoredCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(
      CURRENT_USER_STORAGE_KEY
    );

    emitStorageChange();

    return;
  }

  localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(user)
  );

  emitStorageChange();
};

/*
 * ============================================================
 * NORMALISATION D'UN COMPTE
 * ============================================================
 */

export const normalizeAccount = (account = {}) => {
  const role = normalizeRole(account.role);

  const availability = Array.isArray(account.availability)
    ? account.availability
    : typeof account.availability === 'string'
      ? account.availability
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : ['Matin'];

  /*
   * IMPORTANT :
   * On conserve l'ID envoyé par le backend.
   *
   * Exemple :
   * backend -> id: 5
   * frontend -> id: 5
   *
   * Pour les anciens comptes qui n'ont pas
   * d'ID backend, l'email reste utilisé
   * comme identifiant de compatibilité.
   */

  let accountId = account.id;

  if (
    accountId !== undefined &&
    accountId !== null &&
    accountId !== ''
  ) {
    const numericId = Number(accountId);

    if (
      Number.isInteger(numericId) &&
      numericId > 0
    ) {
      accountId = numericId;
    }
  } else if (account.email) {
    accountId = account.email;
  } else {
    accountId =
      `user-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
  }

  return {
    id: accountId,

    name:
      account.name ||
      (
        account.prenom ||
        account.nom
          ? `${account.prenom || ''} ${account.nom || ''}`.trim()
          : ''
      ) ||
      'Utilisateur',

    nom:
      account.nom ||
      '',

    prenom:
      account.prenom ||
      '',

    email:
      account.email ||
      '',

    role,

    status:
      account.status ||
      'Actif',

    phone:
      account.phone ||
      account.telephone ||
      '',

    address:
      account.address ||
      account.adresse ||
      account.quartier ||
      '',

    quartier:
      account.quartier ||
      account.address ||
      account.adresse ||
      '',

    childrenCount:
      account.childrenCount ||
      account.nombreEnfants ||
      1,

    bio:
      account.bio ||
      '',

    hourlyRate:
      account.hourlyRate ||
      account.tarifHoraire ||
      35,

    zone:
      account.zone ||
      account.address ||
      account.adresse ||
      account.quartier ||
      'Tunis',

    availability,

    experience:
      account.experience ||
      3,

    photo:
      normalizePhoto(account.photo),

    password:
      account.password ||
      '',

    verified:
      typeof account.verified === 'boolean'
        ? account.verified
        : false,

    languages:
      Array.isArray(account.languages)
        ? account.languages
        : account.language
          ? [account.language]
          : [],

    specialties:
      Array.isArray(account.specialties)
        ? account.specialties
        : [],

    rating:
      account.rating ||
      account.noteMoyenne ||
      4.7,

    reviews:
      Array.isArray(account.reviews)
        ? account.reviews
        : [],

    services:
      Array.isArray(account.services)
        ? account.services
        : ['Garde ponctuelle'],

    registeredAt:
      account.registeredAt ||
      new Date().toISOString().slice(0, 10),

    notes:
      account.notes ||
      '',
  };
};

/*
 * ============================================================
 * PERSISTANCE UTILISATEUR
 * ============================================================
 */

export const persistUserAccount = (
  account,
  options = {}
) => {
  const normalizedAccount =
    normalizeAccount(account);

  const users = getStoredUsers();

  if (normalizedAccount.email) {
    users[normalizedAccount.email] =
      normalizedAccount;

    saveStoredUsers(users);
  }

  if (options.persistSession !== false) {
    saveStoredCurrentUser(
      normalizedAccount
    );
  }

  return normalizedAccount;
};

/*
 * ============================================================
 * UTILISATEURS ENREGISTRES
 * ============================================================
 */

export const getRegisteredUsers = () => {
  const users = getStoredUsers();

  return Object.values(users).map((user) =>
    normalizeAccount(user)
  );
};

export const saveRegisteredUsers = (users) => {
  const nextRegistry = users.reduce(
    (registry, user) => {
      const normalizedUser =
        normalizeAccount(user);

      if (normalizedUser.email) {
        registry[normalizedUser.email] =
          normalizedUser;
      }

      return registry;
    },
    {}
  );

  saveStoredUsers(nextRegistry);

  return nextRegistry;
};

/*
 * ============================================================
 * PROFILS BABYSITTER
 * ============================================================
 */

export const getBabysitterProfiles = () => {
  const users = getStoredUsers();

  const babysitters = Object.values(users).filter(
    (user) =>
      normalizeRole(user.role) ===
      'babysitter'
  );

  /*
   * ==========================================================
   * VRAIS COMPTES BABYSITTER
   * ==========================================================
   */

  if (babysitters.length > 0) {
    return babysitters.map((user) => {
      const normalizedUser =
        normalizeAccount(user);

      return {
        /*
         * IMPORTANT :
         * On utilise maintenant l'ID backend.
         *
         * Avant :
         * email -> id
         *
         * Maintenant :
         * user.id -> id
         */
        id:
          normalizedUser.id,

        name:
          normalizedUser.name ||
          normalizedUser.nom ||
          'Babysitter',

        location:
          user.location ||
          normalizedUser.zone ||
          normalizedUser.address ||
          normalizedUser.quartier ||
          'Tunis',

        rate:
          Number(
            normalizedUser.hourlyRate
          ) || 35,

        experience:
          Number(
            normalizedUser.experience
          ) || 3,

        availability:
          Array.isArray(
            normalizedUser.availability
          )
            ? normalizedUser.availability
            : [
                normalizedUser.availability ||
                'Matin'
              ],

        languages:
          normalizedUser.languages?.length
            ? normalizedUser.languages
            : ['Français', 'Arabe'],

        specialties:
          normalizedUser.specialties?.length
            ? normalizedUser.specialties
            : ['Garde attentive'],

        rating:
          Number(
            normalizedUser.rating
          ) || 4.7,

        reviews:
          Array.isArray(
            normalizedUser.reviews
          )
            ? normalizedUser.reviews
            : [],

        bio:
          normalizedUser.bio ||
          'Babysitter disponible pour les familles.',

        image:
          normalizedUser.photo ||
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',

        services:
          normalizedUser.services ||
          ['Garde ponctuelle'],

        email:
          normalizedUser.email,

        role:
          'babysitter',

        phone:
          normalizedUser.phone ||
          '',

        address:
          normalizedUser.address ||
          normalizedUser.quartier ||
          '',

        zone:
          normalizedUser.zone ||
          normalizedUser.address ||
          normalizedUser.quartier ||
          'Tunis',
      };
    });
  }

  /*
   * ==========================================================
   * PROFILS DE DEMONSTRATION
   * ==========================================================
   */

  const fallbackProfiles =
    fallbackSitters.map((sitter) => ({
      ...sitter
    }));

  const seededEntries =
    Object.fromEntries(
      fallbackProfiles.map((sitter) => [
        sitter.email ||
          `${sitter.id}@demo.local`,

        {
          /*
           * ID du profil demo
           */
          id:
            sitter.id,

          email:
            sitter.email ||
            `${sitter.id}@demo.local`,

          name:
            sitter.name,

          nom:
            sitter.name,

          role:
            'babysitter',

          zone:
            sitter.location,

          address:
            sitter.location,

          quartier:
            sitter.location,

          hourlyRate:
            sitter.rate,

          availability:
            sitter.availability,

          experience:
            sitter.experience,

          bio:
            sitter.bio,

          photo:
            sitter.image,

          languages:
            sitter.languages,

          specialties:
            sitter.specialties,

          rating:
            sitter.rating,

          reviews:
            sitter.reviews,

          services:
            sitter.services,
        }
      ])
    );

  /*
   * Les vrais comptes restent prioritaires.
   */

  const mergedUsers = {
    ...seededEntries,
    ...users
  };

  /*
   * IMPORTANT :
   *
   * NE PAS appeler saveStoredUsers() ici.
   *
   * Cette fonction est appelée par les pages
   * qui écoutent STORAGE_CHANGE_EVENT.
   *
   * Appeler saveStoredUsers() ici créerait une
   * boucle infinie :
   *
   * getBabysitterProfiles()
   *      ↓
   * saveStoredUsers()
   *      ↓
   * emitStorageChange()
   *      ↓
   * getBabysitterProfiles()
   *      ↓
   * ...
   */

  return Object.values(mergedUsers)
    .filter(
      (user) =>
        normalizeRole(user.role) ===
        'babysitter'
    )
    .map((user) => {
      const normalized =
        normalizeAccount(user);

      return {
        id:
          normalized.id,

        name:
          normalized.name,

        location:
          user.location ||
          normalized.zone ||
          'Tunis',

        rate:
          Number(
            normalized.hourlyRate
          ) || 35,

        experience:
          Number(
            normalized.experience
          ) || 3,

        availability:
          normalized.availability,

        languages:
          normalized.languages?.length
            ? normalized.languages
            : ['Français', 'Arabe'],

        specialties:
          normalized.specialties?.length
            ? normalized.specialties
            : ['Garde attentive'],

        rating:
          Number(
            normalized.rating
          ) || 4.7,

        reviews:
          normalized.reviews,

        bio:
          normalized.bio ||
          'Babysitter disponible pour les familles.',

        image:
          normalized.photo,

        services:
          normalized.services,

        email:
          normalized.email,

        role:
          'babysitter',

        phone:
          normalized.phone,

        address:
          normalized.address,

        zone:
          normalized.zone
      };
    });
};

export const STORAGE_CHANGE_EVENT_NAME =
  STORAGE_CHANGE_EVENT;

/*
 * ============================================================
 * ENFANTS
 * ============================================================
 */

const CHILDREN_STORAGE_KEY =
  'confiSitChildren';

export const getChildrenForParent = (
  parentEmail
) => {
  if (!parentEmail) {
    return [];
  }

  const all =
    parseJson(
      CHILDREN_STORAGE_KEY,
      {}
    );

  return Array.isArray(
    all[parentEmail]
  )
    ? all[parentEmail]
    : [];
};

export const saveChildrenForParent = (
  parentEmail,
  children
) => {
  if (!parentEmail) {
    return;
  }

  const all =
    parseJson(
      CHILDREN_STORAGE_KEY,
      {}
    );

  all[parentEmail] =
    children;

  localStorage.setItem(
    CHILDREN_STORAGE_KEY,
    JSON.stringify(all)
  );

  emitStorageChange();
};

/*
 * ============================================================
 * AVIS BABYSITTER
 * ============================================================
 */

export const addBabysitterReview = (
  sitterEmail,
  review
) => {
  if (!sitterEmail) {
    return null;
  }

  const users =
    getStoredUsers();

  const sitter =
    users[sitterEmail];

  if (!sitter) {
    return null;
  }

  const nextReviews =
    Array.isArray(sitter.reviews)
      ? [
          ...sitter.reviews,
          review
        ]
      : [review];

  const ratingValues =
    nextReviews
      .map(
        (item) =>
          Number(item.stars) || 0
      )
      .filter(
        (value) =>
          value > 0
      );

  const nextRating =
    ratingValues.length
      ? Number(
          (
            ratingValues.reduce(
              (sum, value) =>
                sum + value,
              0
            ) /
            ratingValues.length
          ).toFixed(1)
        )
      : sitter.rating;

  users[sitterEmail] = {
    ...sitter,
    reviews:
      nextReviews,
    rating:
      nextRating
  };

  saveStoredUsers(users);

  return users[sitterEmail];
};

/*
 * ============================================================
 * FAVORIS
 * ============================================================
 */

const FAVORITES_STORAGE_KEY =
  'confiSitFavorites';

export const getFavoriteSitterIds = (
  parentEmail
) => {
  if (!parentEmail) {
    return [];
  }

  const all =
    parseJson(
      FAVORITES_STORAGE_KEY,
      {}
    );

  return Array.isArray(
    all[parentEmail]
  )
    ? all[parentEmail]
    : [];
};

export const toggleFavoriteSitter = (
  parentEmail,
  sitterId
) => {
  if (
    !parentEmail ||
    !sitterId
  ) {
    return [];
  }

  const all =
    parseJson(
      FAVORITES_STORAGE_KEY,
      {}
    );

  const current =
    Array.isArray(
      all[parentEmail]
    )
      ? all[parentEmail]
      : [];

  const next =
    current.includes(sitterId)
      ? current.filter(
          (id) =>
            id !== sitterId
        )
      : [
          ...current,
          sitterId
        ];

  all[parentEmail] =
    next;

  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(all)
  );

  emitStorageChange();

  return next;
};

/*
 * ============================================================
 * RESERVATIONS LOCALES
 * ============================================================
 */

const RESERVATIONS_STORAGE_KEY =
  'confiSitReservations';

const LEGACY_RESERVATIONS_STORAGE_KEY =
  'confiSitParentReservations';

export const getReservations = () => {
  const stored =
    localStorage.getItem(
      RESERVATIONS_STORAGE_KEY
    );

  if (stored) {
    try {
      const parsed =
        JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      localStorage.removeItem(
        RESERVATIONS_STORAGE_KEY
      );
    }
  }

  /*
   * Migration ponctuelle depuis
   * l'ancienne clé.
   */

  const legacy =
    localStorage.getItem(
      LEGACY_RESERVATIONS_STORAGE_KEY
    );

  if (legacy) {
    try {
      const parsedLegacy =
        JSON.parse(legacy);

      if (Array.isArray(parsedLegacy)) {
        localStorage.setItem(
          RESERVATIONS_STORAGE_KEY,
          JSON.stringify(
            parsedLegacy
          )
        );

        return parsedLegacy;
      }
    } catch {
      // ignore malformed legacy data
    }
  }

  return [];
};

export const saveReservations = (
  reservations
) => {
  localStorage.setItem(
    RESERVATIONS_STORAGE_KEY,
    JSON.stringify(
      reservations
    )
  );

  emitStorageChange();
};

/*
 * ============================================================
 * SUPPRESSION UTILISATEUR
 * ============================================================
 */

export const deleteUserAccount = (
  email
) => {
  if (!email) {
    return;
  }

  const users =
    getStoredUsers();

  delete users[email];

  saveStoredUsers(users);

  const currentUser =
    getStoredCurrentUser();

  if (
    currentUser?.email ===
    email
  ) {
    saveStoredCurrentUser(null);
  }
};

/*
 * ============================================================
 * MESSAGES
 * ============================================================
 */

const MESSAGES_STORAGE_KEY =
  'confiSitMessages';

export const getMessagesForReservation = (
  reservationId
) => {
  if (!reservationId) {
    return [];
  }

  const all =
    parseJson(
      MESSAGES_STORAGE_KEY,
      {}
    );

  return Array.isArray(
    all[reservationId]
  )
    ? all[reservationId]
    : [];
};

export const sendMessage = (
  reservationId,
  { author, role, text }
) => {
  if (
    !reservationId ||
    !text?.trim()
  ) {
    return [];
  }

  const all =
    parseJson(
      MESSAGES_STORAGE_KEY,
      {}
    );

  const thread =
    Array.isArray(
      all[reservationId]
    )
      ? all[reservationId]
      : [];

  const now =
    new Date();

  const nextMessage = {
    author,
    role,
    text:
      text.trim(),
    date:
      now.toISOString()
        .slice(0, 10),
    time:
      now.toTimeString()
        .slice(0, 5)
  };

  all[reservationId] = [
    ...thread,
    nextMessage
  ];

  localStorage.setItem(
    MESSAGES_STORAGE_KEY,
    JSON.stringify(all)
  );

  emitStorageChange();

  return all[
    reservationId
  ];
};

/*
 * ============================================================
 * VERIFICATION UTILISATEUR
 * ============================================================
 */

export const toggleUserVerification = (
  email
) => {
  if (!email) {
    return null;
  }

  const users =
    getStoredUsers();

  const account =
    users[email];

  if (!account) {
    return null;
  }

  users[email] = {
    ...account,
    verified:
      !account.verified
  };

  saveStoredUsers(users);

  return users[email];
};