import { FirebaseError } from 'firebase-admin';
import httpStatus from 'http-status';
import { TErrorSources, TGenericResponse } from "../../interface/error.interface";

const handleFirebaseValidationError = (err: FirebaseError): TGenericResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.code || 'unknown',
      message: err.message || 'Firebase validation error'
    }
  ];

  const statusCode = Number(httpStatus.NOT_FOUND);

  return {
    statusCode,
    message: 'Validation error',
    errorSources
  };
};

export default handleFirebaseValidationError;