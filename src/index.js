import express from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/logger.js';
import { authRouter } from './modules/auth/auth.route.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { redisClient } from './config/redis-client.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './modules/user/user.route.js';
import { fileRouter } from './modules/file/file.route.js';
import { prisma } from './config/prisma.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

async function assertDatabaseConnectionOk() {
    logger.info(`[DB] Checking database connection...`);
    try {
        await prisma.$connect();
        logger.info('[DB] Database connection OK!');
    } catch (error) {
        logger.error('[DB] Unable to connect to the database:', error);
        process.exit(1);
    }
}

async function assertRedisConnectionOk() {
    logger.info(`[REDIS] Checking redis connection...`);
    try {
        await redisClient.connect();
        logger.info('[REDIS] Redis connection OK!');
    } catch (error) {
        logger.error('[REDIS] Unable to connect to the redis:');
        logger.error(error);
        process.exit(1);
    }
}

await assertDatabaseConnectionOk();
await assertRedisConnectionOk();

app.use(cors({ credentials: true, origin: '*' }));
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(userRouter);
app.use('/file', fileRouter);

app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
});
