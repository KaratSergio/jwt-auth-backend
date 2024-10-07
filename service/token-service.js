import jwt from 'jsonwebtoken';
import tokenModel from '../models/token-model.js';

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

const validateAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
};

const validateRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  return await tokenModel.create({ user: userId, refreshToken });
};

const removeToken = async (refreshToken) => {
  return await tokenModel.deleteOne({ refreshToken });
};

const findToken = async (refreshToken) => {
  return await tokenModel.findOne({ refreshToken });
};

export default {
  generateToken,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  findToken,
};
