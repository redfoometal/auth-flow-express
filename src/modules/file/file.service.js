import { rimraf } from 'rimraf';
import { models } from '../../sequelize/index.js';
import { NotFoundException } from '../../lib/http-exeption.js';
import { logger } from '../../lib/logger.js';

class FileService {
    constructor(models) {
        this.models = models;
    }
    async uploadFile(name, mimetype, extension, size, path) {
        try {
            const file = await this.models.file.create({
                name,
                mimetype,
                extension,
                size,
                path,
            });
            logger.info(`File ${file.name}${file.extension} uploaded successfully`);
            return file;
        } catch (error) {
            throw error;
        }
    }

    async getFileInfo(fileId) {
        try {
            const fileRecord = await this.models.file.findByPk(fileId);
            if (!fileRecord) throw new NotFoundException('File not found');

            return fileRecord;
        } catch (error) {
            throw error;
        }
    }

    async getList(page, list_size) {
        try {
            const files = await this.models.file.findAll({ limit: list_size, offset: (page - 1) * list_size });
            return files;
        } catch (error) {
            throw error;
        }
    }

    async updateFile(id, file) {
        try {
            const fileRecord = await this.models.file.findByPk(id);
            if (!fileRecord) {
                rimraf(file.path);
                throw new NotFoundException('File not found');
            }
            const fileRecordPath = fileRecord.path;
            await fileRecord.update(file);
            rimraf(fileRecordPath);
            logger.info(`Update file with id ${fileRecord.id}`);
            return fileRecord;
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(id) {
        try {
            const file = await this.models.file.findByPk(id);
            await file.destroy();
            rimraf(file.path);
            logger.info(`Delete file with id ${file.id}`);
            return { message: 'File deleted' };
        } catch (error) {
            throw error;
        }
    }
}

export const fileService = new FileService(models);
