const express = require('express');
const { body } = require('express-validator');

const itemsController = require('../controllers/itemsController');

const router = express.Router();

// GET /item-list/items
router.get('/items', itemsController.getItems);

// POST /item-list/item
router.post(
    '/item',
    [
        body('title')
            .trim()
            .isLength({ min: 5})
    ],
    itemsController.postItem
);

module.exports = router;