import axios from 'axios';

const API_URL = 'http://localhost:8082/api/reclamations';

const apiServiceReclamation = {

  // Envoyer une nouvelle réclamation
  envoyerReclamation: async (userId, sujet, description) => {
    const response = await axios.post(API_URL, {
      userId: Number(userId),
      sujet,
      description,
    });

    return response.data;
  },

  // Récupérer les réclamations d'un utilisateur
  listerPourUtilisateur: async (userId) => {
    const response = await axios.get(
      `${API_URL}/user/${Number(userId)}`
    );

    return response.data;
  },

  // Récupérer toutes les réclamations pour l'admin
  listerToutesLesReclamations: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
};

export default apiServiceReclamation;