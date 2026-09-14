import axios from 'axios';

const API_URL = 'http://localhost:8082/api/historique';

const apiServiceHistoriqueReservation = {
  /**
   * Enregistre la génération du reçu PDF dans le backend.
   */
  genererPDF: async (reservationId) => {
    const id = Number(reservationId);

    if (!id || id <= 0) {
      throw new Error(`ID de réservation invalide : ${reservationId}`);
    }

    console.log(
      'Envoi de la génération PDF au backend pour la réservation :',
      id
    );

    const response = await axios.post(
      `${API_URL}/${id}/generer-pdf`
    );

    console.log(
      'Historique PDF enregistré :',
      response.data
    );

    return response.data;
  },

  /**
   * Récupère l'historique PDF d'une réservation.
   */
  trouverParReservation: async (reservationId) => {
    const id = Number(reservationId);

    if (!id || id <= 0) {
      throw new Error(`ID de réservation invalide : ${reservationId}`);
    }

    const response = await axios.get(
      `${API_URL}/${id}`
    );

    return response.data;
  },
};

export default apiServiceHistoriqueReservation;