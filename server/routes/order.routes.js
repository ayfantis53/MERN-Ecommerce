import express from 'express';

import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js'
import { getOrder, getMyOrders, getOrders, newOrder, updateOrder, deleteOrder } from '../controllers/order.controllers.js';


const router = express.Router();

router.route('/:id').get(isAuthenticatedUser, getOrder);
router.route('/me').get(isAuthenticatedUser, getMyOrders);
router.route('/').get(authorizedRoles('admin'), isAuthenticatedUser, getOrders);

router.route('/').post(isAuthenticatedUser, newOrder);

router.route('/:id').put(authorizedRoles('admin'), isAuthenticatedUser, updateOrder);
router.route('/:id').delete(authorizedRoles('admin'), isAuthenticatedUser, deleteOrder);


export default router;