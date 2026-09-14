import axios from 'axios';

const API_URL = 'http://localhost:8082/api/reservations';
const USERS_API_URL = 'http://localhost:8082/api/users';

const apiServiceReservation = {

  creerReservation: async (reservationData) => {
    const response = await axios.post(
      API_URL,
      reservationData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },

  trouverToutes: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  trouverParId: async (id) => {
    const response = await axios.get(
      `${API_URL}/${id}`
    );

    return response.data;
  },

  trouverParParent: async (parentId) => {
    const response = await axios.get(
      `${API_URL}/parent/${parentId}`
    );

    return response.data;
  },

  trouverParBabysitter: async (babysitterId) => {
    const response = await axios.get(
      `${API_URL}/babysitter/${babysitterId}`
    );

    return response.data;
  },

  confirmer: async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/confirmer`
    );

    return response.data;
  },

  refuser: async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/refuser`
    );

    return response.data;
  },

  annuler: async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/annuler`
    );

    return response.data;
  },

  terminer: async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/terminer`
    );

    return response.data;
  },

  supprimer: async (id) => {
    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    return response.data;
  },

  /**
   * Récupérer tous les utilisateurs.
   * Permet de retrouver le vrai ID MySQL
   * à partir de l'email.
   */
  trouverTousLesUtilisateurs: async () => {
    const response = await axios.get(
      USERS_API_URL
    );

    return response.data;
  },

  /**
   * Trouver un utilisateur par son email.
   */
  trouverUtilisateurParEmail: async (email) => {

    const users =
      await apiServiceReservation.trouverTousLesUtilisateurs();

    return users.find(
      (user) =>
        user.email?.toLowerCase() ===
        email?.toLowerCase()
    );
  },
};

export default apiServiceReservation;