import { v4 as uuidv4 } from 'uuid';
import { sendActivationMail } from './mail-service.js';
import { ApiError } from '../utils/api-error.js';
import { checkIfUserExists } from '../utils/user-utils.js';
import { createUserSession } from '../utils/session-utils.js';
import { hashUserPassword, comparePassword } from '../utils/password-utils.js';
import tokenService from './token-service.js';
import userModel from '../models/user-model.js';

const registration = async (email, password) => {
  console.log('Starting registration process');

  const candidate = await checkIfUserExists(email);
  if (candidate) {
    throw ApiError.BadRequest(`User with email address ${email} already exists`);
  }

  const hashedPassword = await hashUserPassword(password);
  const activationLink = uuidv4();

  const user = await userModel.create({ email, password: hashedPassword, activationLink });
  await sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

  return createUserSession(user);
};

const login = async (email, password) => {
  const user = await checkIfUserExists(email);
  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  const isPassEquals = await comparePassword(password, user.password);
  if (!isPassEquals) {
    throw ApiError.BadRequest('Incorrect email or password');
  }

  return createUserSession(user);
};

const activate = async (activationLink) => {
  const user = await userModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest('Incorrect activation link');
  }
  user.isActivated = true;
  await user.save();
};

const logout = async (refreshToken) => {
  return await tokenService.removeToken(refreshToken);
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await userModel.findById(userData.id);

  return createUserSession(user);
};

const getAllUsers = async () => {
  return await userModel.find();
};

export default {
  registration,
  login,
  activate,
  logout,
  refresh,
  getAllUsers,
};
