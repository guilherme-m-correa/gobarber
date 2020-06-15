import { Secret } from 'jsonwebtoken';

interface IAuthConfig {
  jwt: {
    secret: Secret;
    expires: string;
  };
}

export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret',
    expires: '1d',
  },
} as IAuthConfig;
