const Product = require('../models/Product');
const fs = require('fs');
const { validationResult } = require('express-validator');

const ITEMS_PER_PAGE = 8;

exports.getProducts = (req, res) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .populate("user")
        })
        .then(products => {
            res.status(200).json({
                pagination: {
                    currentPage: page,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1
                },
                product: products.map(product => {
                    return {
                        _id: product._id,
                        title: product.title,
                        price: product.price,
                        description: product.description,
                        imageUrl: product.imageUrl,
                        user: {
                            _id: product.user._id,
                            username: product.user.username,
                            email: product.user.email
                        }
                    }
                })
            })
        })
        .catch(err => res.status(400).json({err: err.message}))
};

exports.getSingleProduct = (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).json({err: "Product with given ID is non-existent"});
    }

    Product.findById(id)
        .populate("user")
        .then(product => {
            res.status(200).json({
                _id: product._id,
                title: product.title,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                user: {
                    _id: product.user._id,
                    username: product.user.username,
                    email: product.user.email
                }
            })
        })
        .catch(() => res.status(400).json({err: "Product with given ID doesn't exist"}));
}

exports.createProduct = (req, res) => {
    const errors = validationResult(req);
    const { title, price, description, user } = req.body;
    const image = req.file;

    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({error: firstError})
    }

    if(!image){
        return res.status(415).json({error: "Insert image"});
    }

    if(image.size > 1*1024*1024){
        return res.status(415).json({error: "Image size too big. Upto 1MB"});
    }

    const product = new Product({
        title,
        price,
        description,
        imageUrl: image.path,
        user
    });

    product.save()
        .then(() => {
            res.status(201).json({
                message: "Product created"
            })
        })
        .catch(err => res.status(400).json({error: err.message}))
}

const deleteImage = filePath => {
    fs.unlink(filePath, err => {
        if(err){
            console.log(err);
        }
    })
}

exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({error: firstError})
    }

    if(!id){
        return res.status(400).json({err: "Product with given ID is non-existent"});
    }

    Product.findByIdAndRemove(id)
        .then(product => {
            deleteImage(product.imageUrl);
            res.status(200).json({message: "Product deleted"})
        })
        .catch(err => res.status(400).json({err: err.message}));
}

exports.editProduct = (req, res) => {
    const { title, price, description } = req.body;
    const id = req.params.id;
    const image = req.file;

    Product.findById(id)
        .then(product => {
            product.title = title;
            product.price = price;
            if(image) {
                deleteImage(product.imageUrl);
                product.imageUrl = image.path;
            }
            product.description = description;
            
            product.save()
                .then(() => {
                    res.status(200).json({message: "Product updated"})
                })
                .catch(err => res.status(500).json({err: err.message}))
        })
        .catch(err => res.status(500).json({err: err.message}))
}