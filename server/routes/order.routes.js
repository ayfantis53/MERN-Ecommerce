import express from 'express';

import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js'
import { getOrder, getMyOrders, getOrders, newOrder, updateOrder, deleteOrder } from '../controllers/order.controllers.js';


const router = express.Router();

router.route('/:id').get(isAuthenticatedUser, getOrder);
router.route('/me').get(isAuthenticatedUser, getMyOrders);
router.route('/').get(isAuthenticatedUser, authorizedRoles('admin'), getOrders);

router.route('/').post(isAuthenticatedUser, newOrder);

router.route('/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateOrder);
router.route('/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder);


export default router;