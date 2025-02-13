import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import File from './models/file.model.js'

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

const modelDefiners = [User, File];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

const models = sequelize.models;

export { sequelize, models };
