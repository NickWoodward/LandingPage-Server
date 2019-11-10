const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed.');
        errors.statusCode = 422;
        error.data = errors.array();
        throw error;
    } 

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hpassword => {
            User.create({
                username: username,
                email: email,
                password: hpassword
            });
        })
        .then(result => {
            res.status(201).json({message: 'User created!', userId: result.id});
        })
        .catch(err => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        });
};

exports.login = (req, res, next) => {
    console.log('login');
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed.');
        errors.statusCode = 422;
        error.data = errors.array();
        throw error;
    } 
    console.log('hello');
    const email = req.body.email;
    const pass = req.body.password;

    console.log(email, pass);
    res.status(200).json({ message: 'Logged in.'});
};