import axios from 'axios';
import {configType} from './types';
const config: configType = {
  baseURL: 'http://80.78.244.88:3000/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const client = axios.create(config);
export const authApi = {
  login(phone, code) {
    return client.post('login', {phone, code});
  },
  code(data) {
    return client.post('code', data);
  },
  users(data, token) {
    return client.post('users', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  userProfile(data, token) {
    return client.post('userProfile', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getIncomingState(token) {
    return client.get('incomingState', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  setIncomingState(data, token) {
    return client.post('incomingState', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
