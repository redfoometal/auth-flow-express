import jwt from 'jsonwebtoken';

class TokenService {
    async generateTokens(userId, deviceId) {
        const accessToken = await this.#generateAccessToken({ userId });
        const refreshToken = await this.#generateRefreshToken({ userId }, deviceId);
        return { accessToken, refreshToken };
    }

    async #generateAccessToken(payload) {
        return jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    }

    async #generateRefreshToken(payload) {
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return refreshToken;
    }
}

export const tokenService = new TokenService();
