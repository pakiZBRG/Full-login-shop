const { check } = require('express-validator');

exports.validRegister = [
    check('username', 'Username is required').notEmpty()
        .isLength({ min: 4, max: 30 })
        .withMessage('Username must be between 4 and 30 characters'),
    check('email', 'Email is required').isEmail().withMessage('Must be a valid email address'),
    check('password', 'Password is required').notEmpty(),
    check('password').isLength({ min: 8 })
        .withMessage('Password must contain at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
]

exports.validLogin = [
    check('email').isEmail()
        .withMessage('Must be a valid email address'),
    check('password', "Password is requried").notEmpty(),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must contain at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
]

exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
]

exports.validProduct = [
    check('title')
        .isString()
        .withMessage("Title: only letters and numbers allowed")
        .isLength({min: 4, max: 100})
        .withMessage("Title: between 4 and 100 characters"),
    check('price')
        .isFloat()
        .withMessage("Price: decimal point number required"),
    check('description')
        .isLength({min: 5, max: 1000})
        .withMessage("Description: between 5 and 1000 characters")
]