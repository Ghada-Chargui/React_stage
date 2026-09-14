import axios from 'axios';

const API_URL = 'http://localhost:8082/api/notifications';

const apiServiceNotification = {
  getNotifications: async (userId) => {
    const response = await axios.get(
      `${API_URL}/user/${Number(userId)}`
    );

    return response.data;
  },

  getNotificationsNonLues: async (userId) => {
    const response = await axios.get(
      `${API_URL}/user/${Number(userId)}/non-lues`
    );

    return response.data;
  },

  marquerCommeLue: async (notificationId) => {
    const response = await axios.patch(
      `${API_URL}/${Number(notificationId)}/lue`
    );

    return response.data;
  },
};

export default apiServiceNotification;