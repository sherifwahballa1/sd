const express = require('express');

const security = require('../../security');
const { getAllCategories, addCategory } = require('./categoryControllers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/category/home', security.auth(['user', 'admin']), getAllCategories);

router.post('/category/add-category', security.auth(['admin']), addCategory);

module.exports = router;