import { body } from 'express-validator';

export const registrationValidation = [
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 3, max: 32 }).withMessage('Password must be between 3 and 32 characters long'),
];
