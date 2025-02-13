import { generateDeviceId } from '../../lib/generate-device-id.js';
import { UnauthorizedException } from '../../lib/http-exeption.js';
import { authService } from './auth.service.js';

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async setAuthCookies(res, tokens) {
        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        });
        res.cookie('accessToken', tokens.accessToken, {
            maxAge: 10 * 60 * 1000, // 10 min
            secure: true,
            sameSite: 'none',
        });
    }

    async deleteAuthCookies(res) {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
    }

    async signup(req, res, next) {
        try {
            const { id, password } = req.body;
            const userAgent = req.headers['user-agent'];
            const deviceId = await generateDeviceId(userAgent);
            const tokens = await this.authService.signup(id, password, deviceId);
            await this.setAuthCookies(res, tokens);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    }

    async signin(req, res, next) {
        try {
            const { id, password } = req.body;
            const userAgent = req.headers['user-agent'];
            const deviceId = await generateDeviceId(userAgent);
            const tokens = await this.authService.signin(id, password, deviceId);
            await this.setAuthCookies(res, tokens);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    }

    async newToken(req, res, next) {
        try {
            const userAgent = req.headers['user-agent'];
            const deviceId = await generateDeviceId(userAgent);

            const refreshTokenFromCookie = req.cookies.refreshToken;
            const refreshTokenFromBody = req.body.refreshToken;

            if (!refreshTokenFromCookie && !refreshTokenFromBody) {
                await this.deleteAuthCookies(res);
                throw new UnauthorizedException('Refresh token not found');
            }

            const tokens = await this.authService.newToken(refreshTokenFromCookie || refreshTokenFromBody, deviceId);

            await this.setAuthCookies(res, tokens);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { userId } = req.user;
            const userAgent = req.headers['user-agent'];
            const accessToken = req.headers['authorization'].split(' ')[1];
            const deviceId = await generateDeviceId(userAgent);

            await this.authService.logout(userId, deviceId, accessToken);
            res.send({ message: 'success' });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController(authService);
