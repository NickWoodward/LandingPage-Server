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

// PUT /item-list/item/itemid
router.put('/item/:itemid', itemsController.editItem);


// DELETE /item-list/items/itemid
router.delete('/items/:itemid', itemsController.deleteItem);

module.exports = router;