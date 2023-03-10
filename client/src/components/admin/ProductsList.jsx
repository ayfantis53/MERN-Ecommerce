import { useAlert } from 'react-alert';
import { MDBDataTable } from 'mdbreact';
import React, { Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from './Sidebar';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { DELETE_PRODUCT_RESET } from '../../app/constants/productConstants';
import { getAdminProducts, deleteProduct, clearErrors } from '../../app/actions/productActions';


function ProductsList() {

    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success('Product deleted successfully');
            navigate('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

    }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

    /** List of all products */
    const setProducts = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Price', field: 'price', sort: 'asc' },
                { label: 'Stock', field: 'stock', sort: 'asc' },
                { label: 'Actions', field: 'actions', },
            ],
            rows: []
        };

        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: <Fragment>
                    <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2  ml-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(product._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    /** Delete a product as admin */
    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5"> All Products </h1>

                        {/** LIST OF ALL PRODUCTS */}
                        {loading ? <Loader /> : (
                            <MDBDataTable data={setProducts()} className="px-3 bg-white" bordered striped hover />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default ProductsList;