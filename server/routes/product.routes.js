import express from 'express';

import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js'
import { getAdminProducts, getProduct, getProducts, newProduct, updateProduct, deleteProduct, getProductReviews, createReview, deleteProductReview } from '../controllers/product.controllers.js';


const router = express.Router();

router.route('/admin').get(getAdminProducts);

router.route('/').get(getProducts);
router.route('/:id').get(getProduct);
router.route('/:id').put(isAuthenticatedUser, updateProduct);
router.route('/admin').post(isAuthenticatedUser, authorizedRoles('admin'), newProduct);
router.route('/admin/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct);

router.route('/review').get(isAuthenticatedUser, getProductReviews);
router.route('/review').put(isAuthenticatedUser, createReview);
router.route('/review/:id').delete(isAuthenticatedUser, deleteProductReview);


export default router;