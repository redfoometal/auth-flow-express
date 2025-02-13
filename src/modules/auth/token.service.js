import jwt from 'jsonwebtoken';
import { tokenRepository } from './token.repository.js';

class TokenService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async generateTokens(userId, deviceId) {
        const accessToken = await this.#generateAccessToken({ userId });
        const refreshToken = await this.#generateRefreshToken({ userId }, deviceId);
        await this.tokenRepository.saveRefreshToken(userId, deviceId, refreshToken);
        return { accessToken, refreshToken };
    }

    async validateRefreshToken(refreshToken, deviceId) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const userId = payload?.userId;
            if (!userId) return null;

            const storedToken = await this.tokenRepository.getRefreshToken(userId, deviceId);
            if (storedToken !== refreshToken) {
                return null;
            }

            return userId;
        } catch {
            return null;
        }
    }

    async #generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    }

    async #generateRefreshToken(payload) {
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return refreshToken;
    }
}

export const tokenService = new TokenService(tokenRepository);
