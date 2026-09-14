import axios from 'axios';

const API_URL = 'http://localhost:8082/api/disponibilites';

const apiServiceDisponibilite = {
  /**
   * Récupérer toutes les disponibilités d'un babysitter.
   */
  listerParBabysitter: async (babysitterId) => {
    const id = Number(babysitterId);

    if (!id || id <= 0) {
      throw new Error(`ID babysitter invalide : ${babysitterId}`);
    }

    const response = await axios.get(
      `${API_URL}/babysitter/${id}`
    );

    return response.data;
  },

  /**
   * Ajouter une disponibilité.
   */
  ajouterDisponibilite: async (
    babysitterId,
    disponibilite
  ) => {
    const id = Number(babysitterId);

    if (!id || id <= 0) {
      throw new Error(`ID babysitter invalide : ${babysitterId}`);
    }

    const response = await axios.post(
      `${API_URL}/babysitter/${id}`,
      {
        date: disponibilite.date,
        heureDebut: disponibilite.heureDebut,
        heureFin: disponibilite.heureFin,
        disponible:
          disponibilite.disponible !== undefined
            ? disponibilite.disponible
            : true,
      }
    );

    return response.data;
  },

  /**
   * Modifier une disponibilité.
   */
  modifierDisponibilite: async (
    disponibiliteId,
    disponibilite
  ) => {
    const id = Number(disponibiliteId);

    if (!id || id <= 0) {
      throw new Error(
        `ID disponibilité invalide : ${disponibiliteId}`
      );
    }

    const response = await axios.put(
      `${API_URL}/${id}`,
      {
        date: disponibilite.date,
        heureDebut: disponibilite.heureDebut,
        heureFin: disponibilite.heureFin,
        disponible: disponibilite.disponible,
      }
    );

    return response.data;
  },

  /**
   * Supprimer une disponibilité.
   */
  supprimerDisponibilite: async (disponibiliteId) => {
    const id = Number(disponibiliteId);

    if (!id || id <= 0) {
      throw new Error(
        `ID disponibilité invalide : ${disponibiliteId}`
      );
    }

    const response = await axios.delete(
      `${API_URL}/${id}`
    );

    return response.data;
  },
};

export default apiServiceDisponibilite;