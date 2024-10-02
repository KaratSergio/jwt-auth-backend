import { Router } from 'express';
import UserController from '../controllers/user-controller.js';
import { registrationValidation } from '../validators/userValidator.js';

const router = new Router();

router.post('/registration', registrationValidation, UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', UserController.getUsers);

export default router;
