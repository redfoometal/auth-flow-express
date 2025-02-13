import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { tokenRepository } from '../modules/auth/token.repository.js';
import { prisma } from '../config/prisma.js';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
    passReqToCallback: true,
};

passport.use(
    new JwtStrategy(opts, async (req, jwtPayload, done) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const isBlacklisted = await tokenRepository.isTokenBlacklisted(token);

            if (isBlacklisted) {
                return done(null, false);
            }

            const user = await prisma.user.findUnique({
                where: { id: jwtPayload.userId },
            });

            if (!user) {
                return done(null, false);
            }
            return done(null, { userId: user.id });
        } catch (error) {
            return done(error, false);
        }
    }),
);

export const authMiddleware = passport.authenticate('jwt', { session: false });

export default passport;
