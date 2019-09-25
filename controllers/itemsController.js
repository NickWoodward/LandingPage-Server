const { validationResult } = require('express-validator');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const ListItem = require('../models/listItem');

exports.getItems = (req, res, next) => {
    ListItem.findAll()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postItem = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, incorrect input',
            errors: errors.array()
        });
    }

    // Create DB entry if item with same title and author don't exist
    ListItem.findOrCreate({ 
        where: { 
            [Op.and]: [
                {title: req.body.title},
                {author: req.body.author} 
            ]
        },
         defaults: {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            completed: req.body.completed
        }

    })
        .then(result => {
            console.log(result[0], result[1]);
            // result[1] === true  : New object created
            // result[1] === false : Object already present

            if(result[1]) {
                res.status(201).json({  // 201: success & resource created
                    message: 'Item created successfully',
                    item: result[0]
                });
            } else {
                res.status(200).json({
                    message: 'Item already present in the DB',
                    item: result[0]
                });
            }
        }).catch(err => {
            console.log(err);
    });
};