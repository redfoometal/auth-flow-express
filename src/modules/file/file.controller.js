import { BadRequestException, InternalServerErrorException, NotFoundException } from '../../lib/http-exeption.js';
import path from 'path';
import { fileService } from './file.service.js';
import { logger } from '../../lib/logger.js';
import fs from 'fs';

class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(req, res, next) {
        try {
            const file = req.file;
            if (!file) {
                throw new BadRequestException('File not found');
            }
            const { originalname, mimetype, path: filePath, size } = file;
            const extension = path.extname(originalname);
            const originalnameWithoutExt = path.basename(originalname, extension);

            const data = await this.fileService.uploadFile(originalnameWithoutExt, mimetype, extension, size, filePath);
            res.send(data);
        } catch (error) {
            next(error);
        }
    }

    async getFileInfo(req, res, next) {
        try {
            const { id } = req.params;
            const data = await this.fileService.getFileInfo(id);
            res.send(data);
        } catch (error) {
            next(error);
        }
    }

    async getList(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const list_size = parseInt(req.query.list_size) || 10;
            const data = await this.fileService.getList(page, list_size);
            res.send(data);
        } catch (error) {
            next(error);
        }
    }

    async downloadFile(req, res, next) {
        logger.info('Starting file transfer');
        try {
            const { id } = req.params;
            const file = await this.fileService.getFileInfo(id);

            try {
                await fs.promises.access(file.path);
            } catch {
                throw new NotFoundException('Файл не найден');
            }

            res.writeHead(200, {
                'Content-Type': file.mimetype,
                'Content-Length': file.size,
                'Content-Disposition': `attachment; filename="${file.name}${file.extension}"`,
            });

            const fileStream = fs.createReadStream(file.path);

            fileStream.pipe(res);

            fileStream.on('end', () => {
                logger.info(`File ${file.name}${file.extension} transferred successfully`);
            });

            fileStream.on('error', (err) => {
                logger.error(`Error transferring file ${file.name}${file.extension}:`, err);
                InternalServerErrorException(`Error transferring file ${file.name}${file.extension}`);
            });
        } catch (error) {
            next(error);
        }
    }

    async updateFile(req, res, next) {
        logger.info('Starting file update');
        try {
            const { id } = req.params;
            const file = req.file;
            if (!file) {
                throw new BadRequestException('File not found');
            }
            const { originalname, mimetype, path: filePath, size } = file;
            const extension = path.extname(originalname);
            const originalnameWithoutExt = path.basename(originalname, extension);

            const data = await this.fileService.updateFile(id, {
                name: originalnameWithoutExt,
                mimetype,
                extension,
                size,
                path: filePath,
            });
            res.send(data);
        } catch (error) {
            next(error);
        }
    }

    async deleteFile(req, res, next) {
        logger.info('Starting file delete');
        try {
            const { id } = req.params;
            const data = await this.fileService.deleteFile(id);
            res.send(data);
        } catch (error) {
            next(error);
        }
    }
}

export const fileController = new FileController(fileService);
