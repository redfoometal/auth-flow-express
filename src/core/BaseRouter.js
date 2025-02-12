import { Router } from 'express';

class BaseRouter {
    constructor() {
        this.router = Router();
    }

    useMiddlewares(middlewares = []) {
        middlewares.forEach((middleware) => {
            this.router.use(middleware);
        });
    }

    setupRoutes() {
        throw new Error('Метод setupRoutes() должен быть реализован в наследнике');
    }

    getRouter() {
        return this.router;
    }
}

export { BaseRouter };
