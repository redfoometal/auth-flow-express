import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('user', {
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
};
