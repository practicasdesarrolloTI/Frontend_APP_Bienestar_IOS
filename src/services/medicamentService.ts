import { get } from './api';

export const fetchMedicaments = async () => {
  return await get('medicaments');
};