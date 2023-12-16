import axios from 'axios';
import { authorizeApp } from './AppUtils';

export const fetchUserData = async () => {
  try {
    const { data } = await axios({
      url: '/api/loggedInUser',
      withCredentials: true,
    });
    return data;
  } catch (err) {
    const typedErr = err as { message: string };
    if (typedErr.message.indexOf('429') === -1) {
      authorizeApp();
    } else {
      return 429;
    }
  }
};
