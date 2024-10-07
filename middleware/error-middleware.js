export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err && err.status) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Unexpected error' });
}
