import { redisClient } from '../../config/redis-client.js';

class TokenRepository {
    constructor(redisClient) {
        this.client = redisClient.getInstance();
    }

    async saveRefreshToken(userId, deviceId, refreshToken) {
        const key = `user:${userId}:device:${deviceId}`;
        await this.client.set(key, refreshToken, { EX: 60 * 60 * 24 * 30 });
    }

    async getRefreshToken(userId, deviceId) {
        const key = `user:${userId}:device:${deviceId}`;
        return await this.client.get(key);
    }

    async deleteRefreshToken(userId, deviceId) {
        await this.client.del(`user:${userId}:device:${deviceId}`);
    }
}

export const tokenRepository = new TokenRepository(redisClient);
