import { BaseRouter } from '../../core/BaseRouter.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { userController } from './user.contoller.js';

class UserRouter extends BaseRouter {
    constructor(userController) {
        super();
        this.userController = userController;
        this.useMiddlewares([authMiddleware]);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/info', this.userController.getInfo.bind(this.userController));
    }
}

export const userRouter = new UserRouter(userController).getRouter();
