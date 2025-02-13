import { authController } from './auth.controller.js';
import { BaseRouter } from '../../core/BaseRouter.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { body } from 'express-validator';

class AuthRouter extends BaseRouter {
    constructor(authController) {
        super();
        this.authController = authController;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post(
            '/signup',
            validate([
                body('id').custom((value) => {
                    if (!/\S+@\S+\.\S+/.test(value) && !/^\+?\d{10,15}$/.test(value)) {
                        throw new Error('id must be a valid email or phone number');
                    }
                    return true;
                }),
                body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
            ]),
            this.authController.signup.bind(this.authController),
        );

        this.router.post(
            '/signin',
            validate([
                body('id').custom((value) => {
                    if (!/\S+@\S+\.\S+/.test(value) && !/^\+?\d{10,15}$/.test(value)) {
                        throw new Error('id must be a valid email or phone number');
                    }
                    return true;
                }),
                body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
            ]),
            this.authController.signin.bind(this.authController),
        );

        this.router.post('/signin/new_token', this.authController.newToken.bind(this.authController));
        this.router.get('/logout', authMiddleware, this.authController.logout.bind(this.authController));
    }
}

export const authRouter = new AuthRouter(authController).getRouter();
