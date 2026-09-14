import axios from 'axios';

const API_URL = 'http://localhost:8082/api/users';

const apiServiceUser = {

  /**
   * Récupérer tous les utilisateurs
   */
  listerTous: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },


  /**
   * Récupérer un utilisateur par son ID
   */
  trouverParId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },


  /**
   * Ajouter un nouvel utilisateur
   */
  ajouterUtilisateur: async (userData) => {
    const response = await axios.post(
      API_URL,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },


  /**
   * Connexion d'un utilisateur
   */
  login: async (credentials) => {
    const response = await axios.post(
      `${API_URL}/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },


  /**
   * Modifier un profil
   */
  modifierProfil: async (id, updates) => {
    const response = await axios.put(
      `${API_URL}/${id}`,
      updates,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },


  /**
   * Supprimer un utilisateur
   */
  supprimerUtilisateur: async (id) => {
    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    return response.data;
  },
};

export default apiServiceUser;