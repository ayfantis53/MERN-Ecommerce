import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import MetaData from '../layouts/MetaData';
import { addItemToCart, removeItemFromCart } from '../../app/actions/cartActions';


function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector(state => state.cart);

    const removeCartItemHandler = (id) => {
        dispatch(removeItemFromCart(id));
    };

    /** Increase Item amount by 1 per click */
    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;

        if (newQty > stock) return;

        dispatch(addItemToCart(id, newQty))
    };

    /** Decrease Item amount by 1 per click */
    const decreaseQty = (id, quantity) => {

        const newQty = quantity - 1;

        if (newQty <= 0) return;

        dispatch(addItemToCart(id, newQty))

    };

    /** Checkout/ If not logged in send user to login page */
    const checkoutHandler = () => {
        
        navigate('/login?redirect=shipping');
    };

    return (
        <Fragment>
            <MetaData title={ 'Your Cart' } />

            {cartItems.length === 0 ? <h2 className='mt-5'> Your Cart is Empty </h2> : (
                <Fragment>
                    <h2 className="mt-5"> Your Cart: <b> {cartItems.length} items </b></h2>
        
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8 bg-white">
                            
                            {cartItems.map(item => (
                                <Fragment>
                                    <hr />

                                    {/** CART ITEM */}
                                    <div className="cart-item" key={item.product}>
                                        <div className="row">

                                            {/** CART ITEM IMAGE */}
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt="itemImage" height="90" width="115"/>
                                            </div>

                                            {/** CART ITEM NAME */}
                                            <div className="col-5 col-lg-3">
                                                <Link to={`/products/${item.product}`}> {item.name} </Link>
                                            </div>

                                            {/** CART ITEM PRICE */}
                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price"> {item.price} </p>
                                            </div>

                                            {/** CART ITEM AMOUNT */}
                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    {/** DECREASE ITEM AMOUNT */}
                                                    <span className="btn btn-danger minus" onClick={() => decreaseQty(item.product, item.quantity)}> - </span>
                                                    {/** ITEM QUANTITY */}
                                                    <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />
                                                    {/** INCREASE ITEM AMOUNT */}
                                                    <span className="btn btn-primary plus" onClick={() => increaseQty(item.product, item.quantity, item.stock)}> + </span>
                                                </div>
                                            </div>

                                            {/** DELETE ITEM TRASH BUTTON */}
                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCartItemHandler(item.product)}></i>
                                            </div>

                                        </div>
                                    </div>

                                    <hr />
                                </Fragment>
                            ))}
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            {/** ORDER SUMMARY BOX */}
                            <div id="order_summary" className='bg-white'>
                                <h4> Order Summary </h4>

                                <hr />
                                <p> Subtotal:  <span className="order-summary-values"> {cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units) </span></p>
                                <p> Est. total: <span className="order-summary-values"> $ {cartItems.reduce((acc, item) => (acc + Number(item.quantity) * item.price), 0).toFixed(2)} </span></p>
                                <hr />

                                {/** ORDER SUMMARY CHECKOUT */}
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}> Check out </button>
                            </div>
                        </div>
                    </div>   
                </Fragment>   
            )}
        </Fragment>
    );
}

export default Cart;