const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ListItem = sequelize.define('listItem', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: true
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }

});

module.exports = ListItem;