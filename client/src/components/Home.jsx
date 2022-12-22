import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Pagination from "react-js-pagination";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react';

import { useAlert } from 'react-alert';
import MetaData from './layouts/MetaData';
import { Loader, Product } from './_index';
import { getProducts } from '../app/actions/productActions';




function Home() {

    const alert = useAlert();
    const params = useParams();
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState([1, 1000]);
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['Electronics','Cameras','Laptops','Accessories','Headphones','Food','Books','Clothes/Shoes','Beauty/Health','Sports','Outdoor','Home'];

    const keyword = params.keyword;
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products);

    /** Gets all products from backend */
    useEffect(() => {
        if(error) {
            return alert.error(error);
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating));

    }, [dispatch, error, keyword, alert, currentPage, price, category, rating]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    };

    let count = productsCount;
    if(keyword) {
        count = filteredProductsCount;
    }

    /** Returns all the UI to the webpage */
    return (
        <div className="container container-fluid">
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={ 'Buy Best Products Online' } />

                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        
                                        {/** SEARCH BY PRICE RANGE */}
                                        <div className="px-5">
                                            <Slider
                                                range
                                                marks={{1:`$1`, 1000: `$1000`}}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]} 
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{placement: "top", visible: true}}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />

                                            <hr className="my-5" />

                                            {/** SEARCH BY CATEGORY */}
                                            <div className="mt-5">
                                                <h4 className="mb-3"> Categories </h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li style={{cursor:'pointer', listStyleType:'none'}} key={category} onClick={()=>setCategory(category)}>
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <hr className="my-3" />
                                            
                                            {/** SEARCH BY RATING */}
                                            <div className="mt-5">
                                                <h4 className="mb-3"> Rating </h4>
                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li style={{cursor:'pointer', listStyleType:'none'}} key={star} onClick={()=>setRating(star)}>
                                                            <div className="rating-outer">
                                                                <div className="rating-inner" style={{width:`${star * 20}%`}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products.map(product => (
                                    <Product key={product._id} product={product} col={3} />
                                ))
                            )}   
                        </div>
                    </section>

                    {resPerPage <= count && (
                        <div className='d-flex justify-content mt-5'>
                            <Pagination 
                                activePage={currentPage} 
                                itemsCountPerPage={resPerPage} 
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </div>
    );
}

export default Home;