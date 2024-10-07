export const ApiError = (status, message, errors = []) => {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;

  return error;
};

ApiError.UnauthorizedError = () => ApiError(401, 'User is not authorized');
ApiError.BadRequest = (message, errors = []) => ApiError(400, message, errors);
