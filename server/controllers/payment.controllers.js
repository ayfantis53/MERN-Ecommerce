import {loadStripe} from '@stripe/stripe-js';

import catchAsyncError from '../middleware/catchAsyncError.js';


const stripe = await loadStripe(process.env.STRIPE_SECRET_KEY);

/* @DESC   process Stripe Payments ------------------------------------------------------------------------
*  @ROUTE  POST payment/process
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const processPayments = catchAsyncError(async(req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({ success: true, client_secret: paymentIntent.client_secret });
});

// 
/* @DESC   Send stripe API Key ----------------------------------------------------------------------------
*  @ROUTE  GET payment/stripeapi
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const sendStripeApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({  stripeApiKey: process.env.STRIPE_API_KEY });

});