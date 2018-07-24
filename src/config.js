// @flow
const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY,
    EMAIL_VAPID_KEY,
} = process.env;

export const MYSQL_SETTINGS = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
};

// eslint-disable-next-line prefer-destructuring
export const GCM_API_KEY = process.env.GCM_API_KEY;

export const VAPID_KEYS = {
    publicKey: PUBLIC_VAPID_KEY,
    privateKey: PRIVATE_VAPID_KEY,
    email: `mailto:${EMAIL_VAPID_KEY || ''}`,
};

export const API_SECRET = process.env.API_SECRET;
