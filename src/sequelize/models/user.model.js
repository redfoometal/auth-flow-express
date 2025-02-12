import argon2 from 'argon2';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('user', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    });

    return User;
};
