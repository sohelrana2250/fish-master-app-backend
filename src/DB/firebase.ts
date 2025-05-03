import admin from 'firebase-admin';
import dotenv from 'dotenv';
import config from '../app/config';
import ApiError from '../app/error/ApiError';
import httpStatus from 'http-status';

dotenv.config();

if (
  !config.firebase_account_key.type ||
  !config.firebase_account_key.project_id ||
  !config.firebase_account_key.private_key_id ||
  !config.firebase_account_key.private_key ||
  !config.firebase_account_key.client_email ||
  !config.firebase_account_key.client_id ||
  !config.firebase_account_key.auth_uri ||
  !config.firebase_account_key.token_uri ||
  !config.firebase_account_key.auth_provider_x509_cert_url ||
  !config.firebase_account_key.client_x509_cert_url ||
  !config.firebase_account_key.universe_domain
) {
  throw new ApiError(
    httpStatus.NOT_FOUND,
    'Missing Firebase configuration in environment variables',
    '',
  );
}

admin.initializeApp({
  credential: admin.credential.cert({
    type: config.firebase_account_key.type,
    project_id: config.firebase_account_key.project_id,
    private_key_id: config.firebase_account_key.private_key_id,
    private_key: config.firebase_account_key.private_key?.replace(/\\n/g, '\n'), // 🔥 Fix is here
    client_email: config.firebase_account_key.client_email,
    client_id: config.firebase_account_key.client_id,
    auth_uri: config.firebase_account_key.auth_uri,
    token_uri: config.firebase_account_key.token_uri,
    auth_provider_x509_cert_url:
      config.firebase_account_key.auth_provider_x509_cert_url,
    client_x509_cert_url: config.firebase_account_key.client_x509_cert_url,
    universe_domain: config.firebase_account_key.universe_domain,
  } as admin.ServiceAccount),
});

const db = admin.firestore();
export default db;
