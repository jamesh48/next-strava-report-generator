import axios, { AxiosResponse } from 'axios';

export const authorizeApp = async () => {
  const response: AxiosResponse = await axios('/api/authLink');
  location = response.data;
};
