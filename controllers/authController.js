const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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
            return User.create({
                username: username,
                email: email,
                password: hpassword
            });
        })
        .then(result => {
            res.status(201).json({ message: 'User created!', userId: result.id });
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    let loadedUser;

    User.findOne({ where: { email: email } })
        .then(user => {
            if(!user) {
                const error = new Error('Incorrect username or password');
                error.statusCode = 401;
                throw error;
            } else {
                loadedUser = user;
                return bcrypt.compare(pass, user.password);
            }
        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error('Incorrect username or password');
                error.statusCode = 401;
                throw error;
            } else {
                const token = jwt.sign(
                    {
                        email: loadedUser.email,
                        userId: loadedUser.id
                    }, 
                    process.env.JWT_SECRET,
                    { expiresIn: '1hr' }
                );
                res.status(200).json({ token: token, userId: loadedUser.id, username: loadedUser.username });
            }
        })
        .catch(err => {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        });

};