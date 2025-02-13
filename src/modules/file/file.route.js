import { BaseRouter } from '../../core/BaseRouter.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { fileController } from './file.controller.js';

class FileRouter extends BaseRouter {
    constructor(fileController) {
        super();
        this.fileController = fileController;
        this.useMiddlewares([authMiddleware]);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/upload', upload.single('file'), this.fileController.uploadFile.bind(this.fileController));
        this.router.get('/list', this.fileController.getList.bind(this.fileController));
        this.router.get('/download/:id', this.fileController.downloadFile.bind(this.fileController));
        this.router.put('/update/:id', upload.single('file'), this.fileController.updateFile.bind(this.fileController));
        this.router.delete('/delete/:id', this.fileController.deleteFile.bind(this.fileController));
        this.router.get('/:id', this.fileController.getFileInfo.bind(this.fileController));
    }
}

export const fileRouter = new FileRouter(fileController).getRouter();
