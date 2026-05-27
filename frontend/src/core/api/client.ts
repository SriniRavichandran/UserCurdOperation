import axios from 'axios';
import { EXPRESS_URL, JSON_SERVER_URL } from '../config/constants';

export type ApiMode = 'express' | 'json-server';

// Create separate axios instances
export const expressClient = axios.create({ baseURL: EXPRESS_URL });
export const jsonServerClient = axios.create({ baseURL: JSON_SERVER_URL });

export const getClient = (mode: ApiMode) => {
  return mode === 'express' ? expressClient : jsonServerClient;
};
