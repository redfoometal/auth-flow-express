import { createClient } from 'redis';
import { logger } from '../lib/logger.js';

class RedisClient {
    constructor(redis) {
        this.client = createClient();
        this.client.on('error', (err) => logger.info('Redis Client Error', err));
    }

    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    getInstance() {
        return this.client;
    }
}

export const redisClient = new RedisClient();
