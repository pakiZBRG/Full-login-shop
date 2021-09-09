const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { errorHandler } = require('../helpers/ErrorHandler');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Orders = require('../models/Orders');


exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);

    try{
        const userExist = await User.findOne({username});
        if(userExist) return res.status(400).json({error: 'Username is taken'});

        if(!errors.isEmpty()){
            const firstError = errors.array().map(error => error.msg)[0]
            return res.status(422).json({error: firstError})
        }
        
        else {
            User.findOne({email})
                .exec((err, user) => {
                    if(user){
                        return res.status(400).json({
                            error: "Email is taken"
                        })
                    }
                })
            
            //Configuring token
            const token = jwt.sign(
                { username, email, password },
                process.env.JWT_ACCOUNT_ACTIVATION,
                { expiresIn: 900 }
            )
    
            //Send activation link to user email
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Account activation link",
                //change PUBLIC_URL -> CLIENT_URL if in development
                html: `
                    <h3>Please Click on Link to Activate:</h3>
                    <p>${process.env.PUBLIC_URL}/users/activate/${token}</p>
                    <hr/>
                `
            }

            const transport = {
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASSWORD
                }
            };
            const transporter = nodemailer.createTransport(transport);
    
            transporter.verify((err, success) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Server is ready to take messages");
                }
            });
    
            transporter.sendMail(emailData, function(err, info){
                if(err) {
                    console.log(err);
                } else {
                    console.log(`Email send to ${info.response}`);
                    return res.json({
                        message: `Email has been sent to ${email}`
                    });
                }
            });
        }
    } catch(err){
        res.status(500).json({err: err.message})
    }
}

exports.activateUser = (req, res) => {
    const {token} = req.body;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
        if(err) {
            return res.status(401).json({error: 'Token has expired (15min). Login again'})
        } else {
            //if valid save to database
            const {username, email, password} = jwt.decode(token);
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashPassword
            });

            //Put in mongoDB
            user.save()
                .then(() => {
                    res.json({
                        success: true,
                        message: 'Signup success'
                    })
                })
                .catch(err => res.status(401).json({error: errorHandler(err)}));
        }
    });
}

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    }
    else {
        //if user exists
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({error: 'No user with given email. Please sign up or try another email'});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).json({error: "Wrong Password"});

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '10d'})

        const { _id, username, email } = user;
        return res.json({
            success: true,
            token,
            user: {
                id: _id,
                username,
                email
            }
        })
    }
}

exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    }
    else {
        //If user with given email exists
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({error: 'No user with given email.'});

        //Generate token for 15 minutes
        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '15min'});

        //Send email with this token
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: req.body.email,
            subject: "Reset password link",
            //change PUBLIC_URL -> CLIENT_URL if in development
            html: `
                <h3>Please Click on Link to Reset Password:</h3>
                <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                <hr/>
            `
        }

        return user
            .updateOne({ resetPasswordLink: token }, (err, success) => {
            if(err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            
            const transport = {
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASSWORD
                }
            };
            const transporter = nodemailer.createTransport(transport);

            transporter.verify((err, success) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Server is ready to take messages");
                }
            });

            return transporter.sendMail(emailData, function(err, info){
                if(err) {
                    console.log(err);
                } else {
                    console.log(`Email send to ${info.accepted[0]}`);
                    return res.status(202).json({message: `Email has been sent to ${info.accepted[0]}`});
                }
            });
        })
    }
}

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if(resetPasswordLink){
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
                if(err) {
                    return res.status(400).json({ error: "Expired Link, send another one." })
                }
                User.findOne({resetPasswordLink}, async (err, user) => {
                    if(err || !user){
                        return res.status(400).json({ error: "Error occured. Try again by sending another reset password link." });
                    }
                    
                    const newHashPassword = await bcrypt.hash(newPassword, 10);
                    const updatedUser = {
                        password: newHashPassword,
                        resetPasswordLink: ""
                    }

                    user = _.extend(user, updatedUser);
                    user.save((err, result) => {
                        if (err) {
                          return res.status(400).json({ error: 'Error resetting user password' });
                        }
                        res.json({message: 'Password successfully reseted'});
                    });
                });
            });
        }
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
exports.googleLogin = (req, res) => {
    //Get token from request
    const {idToken} = req.body;

    client
        .verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT})
        .then(response => {
            const {email_verified, name, email} = response.payload;
            if(email_verified) {
                User.findOne({email})
                    .exec(async (err, user) => {
                        //if user with given email exists
                        if(user){
                            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
                            const { _id, email, username } = user;
                            console.log(`Google user: ${user}`)
                            return res.json({
                                token,
                                user: {_id, email, username}
                            })
                        } else {
                            //if user doesnt exists, it will save data in mongoDB and generate password
                            let password = email + process.env.JWT_SECRET;
                            const newPassword = await bcrypt.hash(password, 10);
                            const user = new User({
                                username: name,
                                email,
                                password: newPassword
                            })

                            user.save((err, data) => {
                                if(err){
                                    console.log(err)
                                    return res.status(400).json({ error: 'User signup failed with Google' })
                                }
                                const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {expiresIn: "7d"});
                                const { _id, email, username } = data;
                                console.log(`Google data: ${data}`)
                                return res.json({
                                    token,
                                    user: {_id, email, username}
                                })
                            })
                        }
                    })
                }
                else {
                    return res.status(400).json({ error: "Google login failed. Try again!" })
                }
        });
}

exports.facebookLogin = (req, res) => {
    const {userID, accessToken} = req.body;
    const url = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,email&access_token=${accessToken}`;

    return (
        fetch(url, { method:'GET' })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                const {email, name} = response;
                User.findOne({email})
                    .exec(async (err, user) => {
                        //if user with given email exists -> Same w/ Google
                        if(user){
                            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
                            const { _id, email, name } = user;
                            console.log(`Facebook user: ${user}`)
                            return res.json({
                                token,
                                user: {_id, email, name}
                            })
                        }
                        //if user doesnt exists, it will save data in mongoDB and generate password
                        else {
                            let password = email + process.env.JWT_SECRET;
                            const newPassword = await bcrypt.hash(password, 10);
                            user = new User({ 
                                username: name,
                                email,
                                password: newPassword
                            })

                            user.save((err, data) => {
                                if(err){
                                    return res.status(400).json({ error: 'User signup failed with Facebook' })
                                }
                                const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {expiresIn: "1d"});
                                const { _id, email, name } = data;
                                console.log(`Facebook data: ${data}`)
                                return res.json({
                                    token,
                                    user: {_id, email, name}
                                })
                            })
                        }
                    })
            })
            .catch(err => res.json({ error: err.message }))
    )
}

exports.getUserData = (req, res) => {
    User.findById(req.params.id)
        .populate('cart.items.product')
        .then(result => {
            res.status(200).json({
                _id: result._id,
                username: result.username,
                email: result.email,
                cart: result.cart
            })
        })
        .catch(err => res.status(500).json({error: err.message}))
}

exports.getUserProducts = (req, res) => {
    Product.find({user: req.params.id})
        .then(result => {
            res.status(200).json({
                message: `All products of ${req.body.user}`,
                products: result.map(p => {
                    return {
                        _id: p._id,
                        title: p.title,
                        price: p.price,
                        description: p.description,
                        imageUrl: p.imageUrl
                    }
                })
            })
        })
        .catch(err => res.status(500).json({error: err}))
}

exports.productToCart = (req, res) => {
    const prodId = req.body.productId;
    const userId = req.params.id;

    // Get the product we want to add to cart
    Product
        .findById(prodId)
        .then(product => {
            if(!product){
                res.status(400).json({error: 'Product doesn\'t exist'});
            }

            // Get the logged-in user
            User.findById(userId)
                .populate('cart.items.product')
                .then(user => {
                    // You cant add your own product into the cart
                    if(product.user != userId){
                        let newQuantity = 1;
                        const updatedCartItems = [...user.cart.items];
                        
                        const index = user.cart.items.findIndex(item => {
                            return item.product._id.toString() === prodId.toString();
                        });

                        // if we have a product to cart
                        if(index >= 0) {
                            newQuantity = user.cart.items[index].quantity + 1;
                            updatedCartItems[index].quantity = newQuantity;
                            res.status(200).json({message: "Product added to cart"})
                        } else {
                            updatedCartItems.push({
                                product: product._id,
                                quantity: newQuantity
                            });
                            res.status(200).json({message: "New product added to cart"})
                        }
                        const updatedCart = {
                            items: updatedCartItems
                        };

                        user.cart = updatedCart;
                        return user.save();
                    } else {
                        res.status(409).json({message: "You can't buy your own product"})
                    }
                })
                .catch(err => console.log(err))
            })
        .catch(err => console.log(err))
};

exports.clearCart = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            user.cart = {
                items: []
            };
            res.status(200).json({message: "Cart is cleared"});
            return user.save();
        })
        .catch(err => res.status(500).json({error: err}))
}

exports.removeProductFromCart = (req, res) => {
    const id = req.params.id;
    const prodId = req.body.productId;

    User.findById(id)
        .then(user => {
            const updatedCartItems = user.cart.items.filter(item => {
                return item.product._id.toString() !== prodId.toString()
            });
        
            user.cart.items = updatedCartItems;
            res.status(200).json({message: "Item is removed"});
            return user.save();
        })
        .catch(err => res.status(500).json({error: err}))
}

exports.makeOrder = (req, res) => {
    const {user, items, checkout, date} = req.body;
    const order = new Orders({
        user, items, checkout, date
    });

    order.save()
        .then(() => {
            res.status(200).json({
                message: "Order has been created",
            })
        })
        .catch(err => res.status(500).json({error: err.message}))

}

exports.getOrder = (req, res) => {
    const id = req.params.id;

    Orders.find({user: id})
        .populate('items.product')
        .then(doc => {
            res.status(200).json({
                doc
            })
        })
        .catch(err => res.status(500).json({error: err.message}))
}