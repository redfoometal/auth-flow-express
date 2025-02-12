import { generateDeviceId } from '../../lib/generate-device-id.js';
import { authService } from './auth.service.js';

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(req, res, next) {
        try {
            const { id, password } = req.body;
            const userAgent = req.headers['user-agent'];
            const deviceId = await generateDeviceId(userAgent);
            const tokens = await this.authService.signup(id, password, deviceId);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    }

    async signin(req, res, next) {
        try {
            const { id, password } = req.body;
            const tokens = await this.authService.signin(id, password);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController(authService);
