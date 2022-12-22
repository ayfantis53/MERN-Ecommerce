import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middleware/catchAsyncError.js';


/* @DESC   get a single Order ----------------------------------------------------------------------------
*  @ROUTE  GET order/:id
*  @ACCESS private  
*---------------------------------------------------------------------------------------------------------*/
export const getOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order){
        return next(new ErrorHandler('Order not Found with this ID', 404));
    }
    
    res.status(200).json({ success: true, order });
});

/* @DESC   get logged in User orders ----------------------------------------------------------------------
*  @ROUTE  GET order/me
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getMyOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({ user: req.params.id });
    
    res.status(200).json({ success: true, orders });
});

/* @DESC   get all existing Orders ------------------------------------------------------------------------
*  @ROUTE  GET order/
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => { totalAmount += order.totalPrice });

    res.status(200).json({ success: true, totalAmount, orders });
});

/* @DESC   Create a new Order------------------------------------------------------------------------------
*  @ROUTE  POST order/
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const newOrder = catchAsyncError(async(req, res, next) => {
    const { orderitems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;

    const order = await Order.create({ orderitems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo, paidAt: Date.now(), user: req.user._id });

    res.status(200).json({ success: true, order });
});

/* @DESC   update existing Order --------------------------------------------------------------------------
*  @ROUTE  PUT order/:id
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus == 'Delivered'){
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    order.orderItems.forEach(async item => { await updateStock(item.product, item.quantity) });
    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({ success: true });
});

/** Helper function for Update Order */
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

/* @DESC   delete existing Order --------------------------------------------------------------------------
*  @ROUTE  DELETE order/:id
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErrorHandler('Order not Found with this ID', 404));
    }
    
    await order.remove();

    res.status(200).json({ success: true });
});