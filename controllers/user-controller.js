import userService from '../service/user-service.js';

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(201).json({ message: 'User registered successfully', userData });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(['test', 'test2']);
    } catch (error) {}
  }
}

export default new UserController();
