import httpStatus from 'http-status';
import ApiError from '../../app/error/ApiError';

const formatTimestamps = (data: any): any => {
  try {
    if (!data) return data;

    const formatted = { ...data };

    if (formatted.createdAt) {
      if (formatted.createdAt.toDate) {
        formatted.createdAt = formatted.createdAt.toDate().toISOString();
      } else if (
        formatted.createdAt._seconds !== undefined &&
        formatted.createdAt._nanoseconds !== undefined
      ) {
        formatted.createdAt = new Date(
          formatted.createdAt._seconds * 1000 +
            formatted.createdAt._nanoseconds / 1000000,
        ).toISOString();
      }
    }

    if (formatted.updatedAt) {
      if (formatted.updatedAt.toDate) {
        formatted.updatedAt = formatted.updatedAt.toDate().toISOString();
      } else if (
        formatted.updatedAt._seconds !== undefined &&
        formatted.updatedAt._nanoseconds !== undefined
      ) {
        formatted.updatedAt = new Date(
          formatted.updatedAt._seconds * 1000 +
            formatted.updatedAt._nanoseconds / 1000000,
        ).toISOString();
      }
    }

    return formatted;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'server unavailable',
      error,
    );
  }
};

export default formatTimestamps;
