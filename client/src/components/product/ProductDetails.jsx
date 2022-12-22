import { useAlert } from 'react-alert';
import { Carousel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react';

import Loader from '../layouts/Loader';
import ListReviews from './ListReviews';
import MetaData from '../layouts/MetaData';
import { addItemToCart } from '../../app/actions/cartActions';
import { NEW_REVIEW_RESET } from '../../app/constants/productConstants';
import { getProductDetails, newReview, clearErrors } from '../../app/actions/productActions';


function ProductDetails() {

    const alert = useAlert();
    const params = useParams();
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { user } = useSelector(state => state.auth);
    const { error: reviewError, success } = useSelector(state => state.newReview);
    const { loading, error, product } = useSelector(state => state.productDetails);

    useEffect(() => {
        
        dispatch(getProductDetails(params.id));

        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Reivew posted successfully')
            dispatch({ type: NEW_REVIEW_RESET })
        }
    }, [dispatch, alert, error, success, params.id]);

    /** Put Item in Cart */
    const addToCart = () => {
        dispatch(addItemToCart(params.id, quantity));

        alert.success('Item Added to Cart');
    };

    /** Increase Item Amount buyer wants */
    const increaseQty = () => {
        const count = document.querySelector('.count');

        if (count.valueAsNumber >= product.stock) {
            return;
        }

        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    };

    /** Decrease Item Amount buyer wants */
    const decreaseQty = () => {
        const count = document.querySelector('.count');

        if (count.valueAsNumber <= 1) {
            return;
        }

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    };

    /** Handle setting Starts */
    function setUserRatings() {
        const stars = document.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        });

        /** Animate rating whule setting it */
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
    
                        setRating(this.starValue);
                    } else {
                        star.classList.remove('orange');
                    }
                }
    
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow');
                    }
                }
    
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow');
                }
            })
        };
    };

    /** Set Review Data to be saved to database */
    const reviewHandler = () => {
        const formData = new FormData();
    
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', params.id);
    
        dispatch(newReview(formData));
    };

    return (
        <Fragment>
            <MetaData title={product.name} />

            {loading ? <Loader /> : (
                <Fragment>
                    <div className="row f-flex justify-content-around">

                        {/** IMAGES OF PRODUCT IN CAROUSEL */}
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {product.images && product.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className='d-block w-100' src={image.url} alt={product.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        {/** PRODUCT INFORMATION */}
                        <div className="col-12 col-lg-5 mt-5">

                            {/** PRODUCT NAME AND ID NUMBER */}
                            <h3> { product.name } </h3>
                            <p id="product_id"> {product._id} </p>

                            <hr />

                            {/** PRODUCT RATING */}
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width:`${(product.ratings / 5) * 100}%` }}></div>
                            </div>

                            {/** PRODUCT REVIEWS */}
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                            
                            <hr />

                            {/** PRODUCT PRICE */}
                            <p id="product_price">$ {product.price}</p>

                            {/** PRODUCT AMOUNT THAT USER WANTS + OR - */}
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}> - </span>
                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                                <span className="btn btn-primary plus" onClick={increaseQty}> + </span>
                            </div>

                            {/** ADD TO CART BUTTON */}
                            <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" onClick={addToCart} disabled={product.stock === 0}> 
                                Add to Cart 
                            </button>
                            
                            <hr />

                            {/** OUT OF/IN STOCK STATUS */}
                            <p> 
                                Status: 
                                <span id="stock_status" className={ product.stock > 0 ? 'greenColor' : 'redColor' }> 
                                    { product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
                                </span>
                            </p>

                            <hr />

                            {/** PRODUCT DESCRIPTION */}
                            <h4 className="mt-2"> Description: </h4>
                            <p> { product.description }</p>

                            <hr />

                            {/** PRODUCT SELLER NAME */}
                            <p id="product_seller mb-3"> Sold by: <strong> { product.seller } </strong></p>	
                            {user ? (
                                <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}> Submit Your Review </button>
                            ) : (
                                <div className="alert alert-danger mt-5" type='alert'> Login to post your review. </div>
                            )}
                            
                            
                            {/** PRODUCT RATING */}
                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel"> Submit Your Review </h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>

                                                {/** SET A RATING FOR THE PRODUCT */}
                                                <div className="modal-body">
                                                    <ul className="stars" >
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>

                                                    {/** LEAVE AND SUBMIT A REVIEW */}
                                                    <textarea name="review" id="review" className="form-control mt-3" value={comment} onChange={(e) => setComment(e.target.value)}> </textarea>
                                                    <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={reviewHandler}> Submit </button>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>
                                </div>	
                            </div>	
                        </div>
                    </div>

                    {product.reviews && product.reviews.length > 0 && (
                        <ListReviews reviews={product.reviews} />
                    )}
            </Fragment>
        )}
        </Fragment>  
    )
};

export default ProductDetails;