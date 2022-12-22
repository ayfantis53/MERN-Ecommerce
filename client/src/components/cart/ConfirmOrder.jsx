import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { CheckoutSteps } from '../_index';
import MetaData from '../layouts/MetaData';


function ConfirmOrder() {

    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const { cartItems, shippingInfo } = useSelector(state => state.cart);

    /** Calculate Order Prices */
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment');
    }

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />

            {/** TABS FOR PAYMENT STEPS */}
            <CheckoutSteps shipping confirmOrder />

            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    {/** SHIPPING INFO */}
                    <h4 className="mb-3"> Shipping Info </h4>
                    <p><b> Name: </b> {user && user.name}</p>
                    <p><b> Phone: </b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />

                    {/** PRODUCTS CONSUMER IS BUYING */}
                    <h4 className="mt-4"> Your Cart Items: </h4>

                    {cartItems.map(item => (
                        <Fragment>
                            <hr />
                            <div className="cart-item my-1" key={item.product}>
                                <div className="row">

                                    {/** PRODUCT IMAGE */}
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt="itemImg" height="45" width="65" />
                                    </div>

                                    {/** PRODUCT NAME WITH LINK TO PRODUCT INFO */}
                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>

                                    {/** PRODUCT AMOUNT CONSUMER PURCHASED */}
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>

                                </div>
                            </div>

                            <hr />
                        </Fragment>
                    ))}
                </div>

                {/** ORDER SUMMARY BOX */}
                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4> Order Summary </h4>
                        <hr />
                        <p> Subtotal:  <span className="order-summary-values"> ${itemsPrice} </span></p>
                        <p> Shipping: <span className="order-summary-values"> ${shippingPrice} </span></p>
                        <p> Tax:  <span className="order-summary-values"> ${taxPrice} </span></p>

                        <hr />

                        <p> Total: <span className="order-summary-values"> ${totalPrice} </span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processToPayment}> Proceed to Payment </button>
                    </div>
                </div>

            </div>

        </Fragment>
    );
}

export default ConfirmOrder;