const express = require('express');
const { validLogin, validRegister, forgotPasswordValidator, resetPasswordValidator } = require('../helpers/Validation');
const { registerUser, activateUser, loginUser, forgotPassword, resetPassword, googleLogin, facebookLogin, getUserData, getUserProducts, productToCart, displayCart, clearCart, removeProductFromCart, postCheckout, makeOrder, getOrder } = require('../controllers/users');
const router = express.Router();

//Create an account
router.post('/register', validRegister, registerUser);

//Activate the acount
router.post('/activation', activateUser);

//Login to your account
router.post('/login', validLogin, loginUser);

//Get user data via userId
router.get('/:id', getUserData);

//Get products of user
router.get('/products/:id', getUserProducts);

//Forgotten password
router.post('/forgotpassword', forgotPasswordValidator, forgotPassword);

//Reset password
router.put('/resetpassword', resetPasswordValidator, resetPassword)

//Google Login
router.post('/googlelogin', googleLogin);

//Facebook Login
router.post('/facebooklogin', facebookLogin);

//Add product to cart;
router.post('/cart/:id', productToCart);

// Clear cart
router.post('/clear-cart/:id', clearCart);

// Remove product from cart
router.post('/cart-delete/:id', removeProductFromCart);

// Create an order
router.post('/order', makeOrder);

// View all orders
router.get('/order/:id', getOrder);

module.exports = router;