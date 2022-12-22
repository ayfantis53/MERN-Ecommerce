import React from 'react'
import { Link } from 'react-router-dom';


function Product({ product, col }) {
  return (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
        {/** CARD OF INDIVIDUAL PRODUCT */}
        <div className="card p-3 rounded shadow">
            <img className="card-img-top mx-auto" src={product.images[0].url} alt="img product"/>

            {/** CARD TITLE WITH LINK TO DESCRIPTION */}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                    <Link to={`/products/${product._id}`}>{ product.name }</Link>
                </h5>

                {/** RATING OF PRODUCT */}
                <div className="ratings mt-auto">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width:`${(product.ratings / 5) * 100}%` }}></div>
                    </div>

                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                </div>

                {/** PRICE OF PRODUCT */}
                <p className="card-text">$ {product.price}</p>

                {/** LINK TO DESCRIPTION */}
                <Link to={`/products/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
            </div>
        </div>
    </div>
  )
}

export default Product;