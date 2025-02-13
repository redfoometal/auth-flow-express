import { authController } from './auth.controller.js';
import { BaseRouter } from '../../core/BaseRouter.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

class AuthRouter extends BaseRouter {
    constructor(authController) {
        super();
        this.authController = authController;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/signup', this.authController.signup.bind(this.authController));
        this.router.post('/signin', this.authController.signin.bind(this.authController));
        this.router.post('/signin/new_token', this.authController.newToken.bind(this.authController));
        this.router.get('/logout', authMiddleware, this.authController.logout.bind(this.authController));
    }
}

export const authRouter = new AuthRouter(authController).getRouter();
