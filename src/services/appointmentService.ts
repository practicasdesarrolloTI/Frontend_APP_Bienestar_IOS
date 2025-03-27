import { get } from './api';

export const fetchAppointments = async () => {
  return await get('appointments');
};