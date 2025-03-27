import { get } from './api';

export const fetchPrograms = async () => {
  return await get('programs');
};