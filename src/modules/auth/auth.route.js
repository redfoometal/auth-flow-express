import { authController } from './auth.controller.js';
import { BaseRouter } from '../../core/BaseRouter.js';

class AuthRouter extends BaseRouter {
    constructor() {
        super();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/signup', authController.signup.bind(authController));
        this.router.post('/signin', authController.signin.bind(authController));
        this.router.post('/signin/new_token');
        this.router.get('/logout');
    }
}

export const authRouter = new AuthRouter().getRouter();
