import { rimraf } from 'rimraf';
import { NotFoundException } from '../../lib/http-exeption.js';
import { logger } from '../../lib/logger.js';
import { prisma } from '../../config/prisma.js';

class FileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadFile(name, mimetype, extension, size, path) {
        try {
            const file = await this.prisma.file.create({
                data: {
                    name,
                    mimetype,
                    extension,
                    size,
                    path,
                },
            });

            logger.info(`File ${file.name}${file.extension} uploaded successfully`);
            return file;
        } catch (error) {
            throw error;
        }
    }

    async getFileInfo(fileId) {
        try {
            const fileRecord = await this.prisma.file.findUnique({
                where: { id: fileId },
            });

            if (!fileRecord) throw new NotFoundException('File not found');

            return fileRecord;
        } catch (error) {
            throw error;
        }
    }

    async getList(page, list_size) {
        try {
            const files = await this.prisma.file.findMany({
                skip: (page - 1) * list_size,
                take: list_size,
            });

            return files;
        } catch (error) {
            throw error;
        }
    }

    async updateFile(id, file) {
        try {
            const fileRecord = await this.prisma.file.findUnique({
                where: { id },
            });
            if (!fileRecord) {
                rimraf(file.path);
                throw new NotFoundException('File not found');
            }

            const updatedFile = await this.prisma.file.update({
                where: { id },
                data: file,
            });

            rimraf(fileRecord.path);

            logger.info(`Update file with id ${fileRecord.id}`);

            return updatedFile;
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(id) {
        try {
            const file = await this.prisma.file.findUnique({
                where: { id },
            });

            if (!file) {
                throw new NotFoundException('File not found');
            }

            await this.prisma.file.delete({
                where: { id },
            });

            rimraf(file.path);

            logger.info(`Delete file with id ${file.id}`);
            return { message: 'File deleted' };
        } catch (error) {
            throw error;
        }
    }
}

export const fileService = new FileService(prisma);
