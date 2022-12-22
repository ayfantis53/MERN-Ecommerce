import cloudinary from 'cloudinary';
import Product from '../models/product.model.js';
import APIFeatures from '../utils/apiFeatures.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middleware/catchAsyncError.js';


/* @DESC   get Products as admin --------------------------------------------------------------------------
*  @ROUTE  GET admin/
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const getAdminProducts = catchAsyncError(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({ success: true, products });

});

/* @DESC   get a single Product by ID----------------------------------------------------------------------
*  @ROUTE  GET products/:id
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const getProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new ErrorHandler('Product not Found', 404));
    }
    
    res.status(200).json({ success: true, product });
});

/* @DESC   get all existing Products------------------------------------------------------------------------
*  @ROUTE  GET products/?keyword=apple
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getProducts = catchAsyncError(async(req, res, next) => {
    /** Pagination */
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    /** Search Products by Keyword */
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().pagination(resPerPage);

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();
    
    res.status(200).json({ success: true, count: products.length, productsCount, resPerPage, filteredProductsCount, products });
});

/* @DESC   Create a new Product----------------------------------------------------------------------------
*  @ROUTE  POST products/admin/
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const newProduct = catchAsyncError(async(req, res, next) => {
    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {folder: 'products'});

        imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(200).json({ success: true, product });
});

/* @DESC   Update a Product---------------------------------------------------------------------------------
*  @ROUTE  PUT products/:id/
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const updateProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        res.status(400).json({ success: false, message: 'Product not found' });
    }

    /** Update Cloudinary images */
    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } 
    else {
        images = req.body.images;
    }

    if (images !== undefined) {
        /** Deleting images associated with the product */
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], { folder: 'products' });

            imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
        }

        req.body.images = imagesLinks;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, updatedProduct });
});

/* @DESC   Delete a Product---------------------------------------------------------------------------------
*  @ROUTE  DELETE products/admin/:id/
*  @ACCESS private 
*---------------------------------------------------------------------------------------------------------*/
export const deleteProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        res.status(400).json({ success: false, message: 'Product not found' });
    }

    /** Deleting images associated with the product */
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({ id: req.params.id, message: 'Product deleted' });
});

/* @DESC   get all Products Reviews -----------------------------------------------------------------------
*  @ROUTE  GET products/review
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getProductReviews = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);
    
    res.status(200).json({ success: true, reviews: product.reviews });
});

/* @DESC   Create a new Review----------------------------------------------------------------------------
*  @ROUTE  PUT products/review
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const createReview = catchAsyncError(async(req, res, next) => {
    const { rating, comment, productId } = req.body;
    
    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(r => r.user.toString() == req.user._id.toString());
    if (isReviewed){
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        });
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, product });
});

/* @DESC   Delete a Product Review ------------------------------------------------------------------------
*  @ROUTE  DELETE products/review/:id/
*  @ACCESS private 
*---------------------------------------------------------------------------------------------------------*/
export const deleteProductReview = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    const numOfReviews = reviews.length;

    await product.findByIdAndUpdate(req.query.id, { reviews, ratings, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({ success: true, message: 'Review deleted' });
});