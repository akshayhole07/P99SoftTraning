const express = require('express');
const router = express.Router();

let items = [
    {
        id: 1,
        name: 'Item 1'
    }
];

let users = [];

// Route 1: GET / - Welcome route
router.get('/', (req, res) => {
    res.send('Hii , Welcome to the Express Server!');
});

// Route 2: GET /items - Retrieve all items
router.get('/items', (req, res) => {
    if(items.length === 0){
        res.status(404).json({ message: 'No items found!' });
    } else {
        res.status(200).json(items);
    }
});

// Route 3: POST /items - Create new item
router.post('/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Route 4: POST /users - Create new user
router.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        age: req.body.age
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

module.exports = router;
