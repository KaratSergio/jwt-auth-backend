import bcrypt from 'bcrypt';

export async function hashUserPassword(password) {
  return bcrypt.hash(password, 3);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
