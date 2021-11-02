const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('uptask', 'root', 'root', {
    host: 'localhost',
    port: '3310',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});