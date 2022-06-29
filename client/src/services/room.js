import api from './api';

export const loadRoom = (id) =>
  api.get(`/room/${id}`).then((response) => response.data);
