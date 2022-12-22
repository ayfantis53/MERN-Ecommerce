import express from 'express';

import { isAuthenticatedUser } from'../middleware/auth.js';
import { processPayments, sendStripeApi } from'../controllers/payment.Controllers.js';


const router = express.Router();

router.route('/process').post(isAuthenticatedUser, processPayments);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApi);


export default router;