import { MulterError } from 'multer';
import { HttpException, InternalServerErrorException } from '../lib/http-exeption.js';
import { logger } from '../lib/logger.js';

const multerErrorMessagesMap = new Map([
    ['LIMIT_FILE_SIZE', 'Файл слишком большой!'],
    ['LIMIT_FILE_COUNT', 'Можно загружать только один файл!'],
]);

export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof HttpException) {
        logger.error({
            err,
            method: req.method,
            url: req.url,
            code: err.code,
        });

        res.status(err.code).json({
            success: false,
            code: err.code,
            message: err.message,
        });
        return;
    }

    if (err instanceof MulterError) {
        logger.error({
            err,
            method: req.method,
            url: req.url,
        });

        const message = multerErrorMessagesMap.get(err.code) || 'Что то пошло не так при загрузке видео';

        res.status(400).json({
            success: false,
            status: 'error',
            message,
        });
        return;
    }

    logger.fatal({
        err,
        method: req.method,
        url: req.url,
    });

    const internalError = new InternalServerErrorException();

    res.status(internalError.code).json({
        success: false,
        code: internalError.code,
        message: internalError.message,
    });
    return;
};
