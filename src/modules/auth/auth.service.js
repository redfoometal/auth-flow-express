import argon2 from 'argon2';
import { ConflictException, NotFoundException } from '../../lib/http-exeption.js';
import { models } from '../../sequelize/index.js';
import { tokenService } from './token.service.js';
import { tokenRepository } from './token.repository.js';

class AuthService {
    constructor(tokenService, tokenRepository, models) {
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
        this.models = models;
    }

    async signup(id, password, deviceId) {
        try {
            const existingUser = await this.models.user.findOne({ where: { id } });
            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            const hashPassword = await argon2.hash(password);
            const user = await this.models.user.create({ id, password: hashPassword });

            return await this.tokenService.generateTokens(user.id, deviceId);
        } catch (error) {
            throw error;
        }
    }

    async signin(id, password, deviceId) {
        try {
            const existingUser = await this.models.user.findOne({ where: { id } });
            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            const isPasswordValid = await argon2.verify(existingUser.password, password);
            if (!isPasswordValid) {
                throw new NotFoundException('Invalid password');
            }

            return await this.tokenService.generateTokens(existingUser.id, deviceId);
        } catch (error) {
            throw error;
        }
    }

    async newToken(refreshToken, deviceId) {
        try {
            const userId = await this.tokenService.validateRefreshToken(refreshToken, deviceId);
            if (!userId) {
                throw new NotFoundException('Invalid refresh token');
            }

            await this.tokenRepository.deleteRefreshToken(userId, deviceId);
            return this.tokenService.generateTokens(userId, deviceId);
        } catch (error) {
            throw error;
        }
    }

    async logout(userId, deviceId, accessToken) {
        try {
            await this.tokenRepository.addToBlacklist(accessToken);
            await this.tokenRepository.deleteRefreshToken(userId, deviceId);
        } catch (error) {
            throw error;
        }
    }
}

export const authService = new AuthService(tokenService, tokenRepository, models);
