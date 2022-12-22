import axios from 'axios';

import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_CART } from '../constants/cartConstants';


/** Adding Items to Cart */
export const addItemToCart = (id, quantity) => async(dispatch, getState) => {
    const { data } = await axios.get(`http://localhost:5000/products/${id}`);

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
};

/** Removing Items to Cart */
export const removeItemFromCart = (id) => async(dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id 
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
};

/** Saving Items to Cart */
export const saveShippingInfo = (data) => async(dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_CART,
        payload: data 
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data));
};
