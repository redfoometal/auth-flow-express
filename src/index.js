import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './sequelize/index.js';
import { logger } from './lib/logger.js';
import { authRouter } from './modules/auth/auth.route.js';
import bodyParser from 'body-parser';
import { errorMiddleware } from './middleware/error.middleware.js';
import useragent from 'useragent';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

async function assertDatabaseConnectionOk() {
    logger.info(`[DB] Checking database connection...`);
    try {
        await sequelize.authenticate();
        logger.info('[DB] Database connection OK!');

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ force: true, alter: true });
            logger.info('[DB] Model synchronization done!');
        }
    } catch (error) {
        logger.error('[DB] Unable to connect to the database:');
        logger.error(error);
        process.exit(1);
    }
}

await assertDatabaseConnectionOk();

// parse application/json
app.use(bodyParser.json());

app.use('/', authRouter);

app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`);
});
