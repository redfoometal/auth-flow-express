import { body, param, query } from 'express-validator';
import { BaseRouter } from '../../core/BaseRouter.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { fileController } from './file.controller.js';

class FileRouter extends BaseRouter {
    constructor(fileController) {
        super();
        this.fileController = fileController;
        this.useMiddlewares([authMiddleware]);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post(
            '/upload',
            upload.single('file'),
            validate([
                body('file').custom((_, { req }) => {
                    if (!req.file) {
                        throw new Error('file must be provided');
                    }
                    return true;
                }),
            ]),
            this.fileController.uploadFile.bind(this.fileController),
        );

        this.router.get(
            '/list',
            validate([
                query('page').optional().isInt({ message: 'page must be a number' }),
                query('list_size').optional().isInt({ message: 'limit must be a number' }),
            ]),
            this.fileController.getList.bind(this.fileController),
        );

        this.router.get(
            '/download/:id',
            validate([param('id').isInt().withMessage('id must be a number')]),
            this.fileController.downloadFile.bind(this.fileController),
        );

        this.router.put(
            '/update/:id',
            upload.single('file'),
            validate([
                param('id').isInt().withMessage('id must be a number'),
                body('file').custom((_, { req }) => {
                    if (!req.file) {
                        throw new Error('file must be provided');
                    }
                    return true;
                }),
            ]),
            this.fileController.updateFile.bind(this.fileController),
        );

        this.router.delete(
            '/delete/:id',
            validate([param('id').isInt().withMessage('id must be a number')]),
            this.fileController.deleteFile.bind(this.fileController),
        );

        this.router.get(
            '/:id',
            validate([param('id').isInt().withMessage('id must be a number')]),
            this.fileController.getFileInfo.bind(this.fileController),
        );
    }
}

export const fileRouter = new FileRouter(fileController).getRouter();
