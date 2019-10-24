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
 
    if (!errors.isEmpty()) {
        const error = new Error('Validation failled, incorrect input');
        error.statusCode = 422;
        throw error;
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
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            completed: req.body.completed
        }

    })
        .then(result => {
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
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteItem = (req, res, next) => {
    const itemid = req.params.itemid;

    console.log(`Item to be deleted: ${itemid}`);

    ListItem.findByPk(itemid)
        .then(item => {
            if(!item) {
                const error = new Error(`Could not find item: ${itemid}`);
                error.statusCode = 404;
                throw error;
            }

            // check logged in user
            if(item)
                return item.destroy();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted post' });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.editItem = (req, res, next) => {
    const itemid = req.params.itemid;
    const errors = validationResult(req);

    console.log(errors);
 
    if (!errors.isEmpty()) {
        const error = new Error(`Validation failed, incorrect input`);
        error.statusCode = 422;
        throw error;
    }

    console.log(req.body);
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    const completed = req.body.completed; 

    ListItem.findByPk(itemid)
        .then(item => {
            item.title = title;
            item.content = content;
            item.author = author;
            item.completed = completed;

            return item.save();
        })
        .then(result => {
            res.send(200).sendStatus('Item successfully edited');
        })
        .catch(err => {
            if(!err.statusCode)
                err.statusCode = 500;

            next(err);
        });

};