import argon2 from 'argon2';
import { ConflictException, NotFoundException } from '../../lib/http-exeption.js';
import { models } from '../../sequelize/index.js';
import { tokenService } from './token.service.js';

class AuthService {
    async signup(id, password, deviceId) {
        try {
            const existingUser = await models.user.findOne({ where: { id } });
            if (existingUser) {
                throw new ConflictException('Пользователь с таким id уже существует');
            }

            const hashPassword = await argon2.hash(password);
            const user = await models.user.create({ id, password: hashPassword });

            return await tokenService.generateTokens(user.id, deviceId);
        } catch (error) {
            throw error;
        }
    }

    async signin(id, password) {
        try {
            const existingUser = await models.user.findOne({ where: { id } });
            if (!existingUser) {
                throw new NotFoundException('Пользователь с таким id не найден');
            }

            const isPasswordValid = await argon2.verify(existingUser.password, password);
            if (!isPasswordValid) {
                throw new NotFoundException('Неверный пароль');
            }

            return await tokenService.generateTokens({ id: existingUser.id });
        } catch (error) {
            throw error;
        }
    }
}

export const authService = new AuthService();
