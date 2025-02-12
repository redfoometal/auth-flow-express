import { Router } from 'express';
import { authController } from './auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', authController.signup.bind(authController));
authRouter.post('/signin', authController.signin.bind(authController));
authRouter.post('/signin/new_token');
authRouter.get('/logout');

export { authRouter };
