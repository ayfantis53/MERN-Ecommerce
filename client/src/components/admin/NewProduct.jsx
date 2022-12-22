import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';

import Sidebar from './Sidebar';
import MetaData from '../layouts/MetaData';
import { NEW_PRODUCT_RESET } from '../../app/constants/productConstants';
import { newProduct, clearErrors } from '../../app/actions/productActions';


function NewProduct() {

    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [ 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', "Books", 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'];

    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.newProduct);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            navigate('/admin/products');
            alert.success('Product created successfully');
            dispatch({ type: NEW_PRODUCT_RESET });
        }

    }, [dispatch, alert, error, success, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('stock', stock);
        formData.set('seller', seller);
        formData.set('category', category);
        formData.set('description', description);

        images.forEach(image => { formData.append('images', image) });

        dispatch(newProduct(formData));
    };

    const onChange = e => {

        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            }

            reader.readAsDataURL(file);
        })
    };

    return (
        <Fragment>
            <MetaData title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>

                                {/** NEW PRODUCT TITLE */}
                                <h1 className="mb-4"> New Product </h1>

                                {/** PRODUCT NAME */}
                                <div className="form-group">
                                    <label htmlFor="name_field"> Name </label>
                                    <input type="text" id="name_field" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>

                                {/** PRODUCT PRICE */}
                                <div className="form-group">
                                    <label htmlFor="price_field"> Price </label>
                                    <input type="text" id="price_field" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)}/>
                                </div>

                                {/** PRODUCT DESCRIPTION */}
                                <div className="form-group">
                                    <label htmlFor="description_field"> Description </label>
                                    <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                {/** PRODUCT CATEGORY */}
                                <div className="form-group">
                                    <label htmlFor="category_field"> Category </label>
                                    <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {categories.map(category => (
                                            <option key={category} value={category}> {category} </option>
                                        ))}
                                    </select>
                                </div>

                                {/** PRODUCT STOCK */}
                                <div className="form-group">
                                    <label htmlFor="stock_field"> Stock </label>
                                    <input type="number" id="stock_field" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)}/>
                                </div>

                                {/** PRODUCT SELLER NAME */}
                                <div className="form-group">
                                    <label htmlFor="seller_field"> Seller Name </label>
                                    <input type="text" id="seller_field" className="form-control" value={seller} onChange={(e) => setSeller(e.target.value)}/>
                                </div>

                                {/** PRODUCT IMAGES */}
                                <div className='form-group'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input type='file' name='product_images' className='custom-file-input' id='customFile' onChange={onChange} multiple/>
                                        <label className='custom-file-label' htmlFor='customFile'> Choose Images </label>
                                    </div>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                </div>

                                {/** SUBMIT BUTTON */}
                                <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading ? true : false}>
                                    CREATE
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default NewProduct;