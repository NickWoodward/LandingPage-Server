const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/authController');

const router = express.Router();
 
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom((value, { req }) => {
            return User.findOne({ where: { email: value } })
                .then(user => {
                    if(user) {
                        return Promise.reject('Email address already exists');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Minimum length of 8 needed'),
    body('username')
        .trim()
        .not().isEmpty()
        .custom((value, { req }) => {
            return User.findOne({ where: { username: value } })
                .then(user => {
                    if(user)
                        return Promise.reject('Username already exits');
                })
        })
], authController.signup);


router.post('/login', authController.login); // No need for validation as we'll be checking anyway

module.exports = router;