const {body} = require('express-validator');
const authenticateToken = require('./authMiddleware');

exports.registerValidator = [
    body('name')
        .isLength({ max: 16, min: 3 }).withMessage('Name must be between 3 and 16 characters long'),
    body('password')
        .isLength({ min:6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginValidator = [
     body('name')
        .isLength({ max:16, min: 3 }).withMessage('Invalid name'),
     body('password')
        .isLength({ min:6 }).withMessage('Invalid password')
];