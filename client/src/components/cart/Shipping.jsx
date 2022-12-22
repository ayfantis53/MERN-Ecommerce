import { countries } from 'countries-list';
import { useNavigate } from 'react-router-dom';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CheckoutSteps } from '../_index';
import MetaData from '../layouts/MetaData';
import { saveShippingInfo } from '../../app/actions/cartActions';


function Shipping() {

    const countriesList = Object.values(countries);
    const { shippingInfo } = useSelector(state => state.cart);

    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [country, setCountry] = useState(shippingInfo.country);
    const [address, setAddress] = useState(shippingInfo.address);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(saveShippingInfo({ city, phoneNo, country, address, postalCode }));
        navigate('/order/confirm');
    };

    return (
        <Fragment>
            <MetaData title={'Shipping Info'} />

            {/** TABS FOR PAYMENT STEPS */}
            <CheckoutSteps shipping/>

            <div class="row wrapper">
                <div class="col-10 col-lg-5">

                    {/** FORM FOR SHIPPING INFO */}
                    <form class="shadow-lg bg-white" onSubmit={submitHandler}>
                        <h1 class="mb-4"> Shipping Info </h1>

                        {/** TEXT INPUT FOR ADDRESS */}
                        <div class="form-group">
                            <label htmlFor="address_field"> Address </label>
                            <input type="text" id="address_field" class="form-control" value={address} onChange={(e)=>setAddress(e.target.value)} required/>
                        </div>

                        {/** TEXT INPUT FOR CITY */}
                        <div class="form-group">
                            <label htmlFor="city_field"> City </label>
                            <input type="text" id="city_field" class="form-control" value={city} onChange={(e)=>setCity(e.target.value)} required/>
                        </div>

                        {/** TEXT INPUT FOR PHONE NO */}
                        <div class="form-group">
                            <label htmlhtmlFor="phone_field"> Phone No </label>
                            <input type="phone" id="phone_field" class="form-control" value={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} required/>
                        </div>

                        {/** TEXT INPUT FOR POSTAL CODE */}
                        <div class="form-group">
                            <label htmlFor="postal_code_field"> Postal Code </label>
                            <input type="number" id="postal_code_field" class="form-control" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} required/>
                        </div>

                        {/** COUNTRY OPTION BOX */}
                        <div class="form-group">
                            <label htmlFor="country_field"> Country </label>
                            <select id="country_field" class="form-control" value={country} onChange={(e)=>setCountry(e.target.value)} required>
                                
                                {countriesList.map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/** FORM SUBMIT BUTTON */}
                        <button id="shipping_btn" type="submit" class="btn btn-block py-3" >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default Shipping;