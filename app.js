require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const ListItem = require('./models/listItem');

const app = express();

// app.use(bodyParser.urlencoded()); // <form> type of request: x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/item-list', itemRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

sequelize.authenticate()
    .then(() => console.log('Connection Established'))
    .catch(e => console.log(e));

sequelize
    // .sync({force: true})
    .sync()
    .then(() => {
        app.listen(8080, () => {
            console.log('Listening on 8080');
        });
    });

