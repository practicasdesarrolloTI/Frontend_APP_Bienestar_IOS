import { get } from './api';

export const fetchResults = async () => {
  return await get('results');
};