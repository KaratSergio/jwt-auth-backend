import { v4 as uuidv4 } from 'uuid';
import mailService from './mail-service.js';
import { ApiError } from '../utils/api-error.js';
import { checkIfUserExists } from '../utils/user-utils.js';
import { createUserSession } from '../utils/session-utils.js';
import { hashUserPassword, comparePassword } from '../utils/password-utils.js';
import tokenService from './token-service.js';
import userModel from '../models/user-model.js';

class UserService {
  async registration(email, password) {
    console.log('Starting registration process');

    const candidate = await checkIfUserExists(email);
    if (candidate) {
      throw ApiError.BadRequest(`User with email address ${email} already exists`);
    }

    const hashedPassword = await hashUserPassword(password);
    const activationLink = uuidv4();

    const user = await userModel.create({ email, password: hashedPassword, activationLink });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    return createUserSession(user);
  }

  async login(email, password) {
    const user = await checkIfUserExists(email);
    if (!user) {
      throw ApiError.BadRequest('User with this email does not exist');
    }

    const isPassEquals = await comparePassword(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect email or password');
    }

    return createUserSession(user);
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link');
    }
    user.isActivated = true;
    await user.save();
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
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
  }

  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}

export default new UserService();
