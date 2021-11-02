const { Sequelize } = require("sequelize");

const db = new Sequelize('uptasknode', 'root', 'root', {
    host: 'localhost',
    port: '3310',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

module.exports = db;