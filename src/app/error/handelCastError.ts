


// handelCastError
import { FirebaseError } from 'firebase-admin';
import { TErrorSources } from "../../interface/error.interface";
import httpStatus from "http-status";

/**
 * Handles Firebase document ID errors (equivalent to Mongoose CastError)
 * @param err Firebase error that occurred during document operations
 * @returns Error object with status code, message and error sources
 */
const handelCastError = (err: FirebaseError) => {
  // Extract document path from error message if available
  let path = 'id';
  
  // Try to extract path from common Firebase error message patterns
  const pathMatch = err.message.match(/(?:at |path |reference |document )([^\s:]+)/i);
  if (pathMatch && pathMatch[1]) {
    path = pathMatch[1];
  }
  
  // Define error sources similar to Mongoose version
  const errorSources: TErrorSources = [
    { path: path, message: err.message }
  ];
  
  const statusCode = Number(httpStatus.NOT_FOUND);
  
  return {
    statusCode,
    message: 'InValidate id',
    errorSources
  };
};

export default handelCastError;