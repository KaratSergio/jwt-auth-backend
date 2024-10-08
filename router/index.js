import { Router } from 'express';
import * as UserController from '../controllers/user-controller.js';
import { registrationValidation } from '../validators/userValidator.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const router = new Router();

router.post('/registration', registrationValidation, UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);

export default router;
