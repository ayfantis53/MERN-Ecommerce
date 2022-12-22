import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';

import MetaData from '../layouts/MetaData';
import { forgotPassword, clearErrors } from '../../app/actions/userActions';

function ForgotPassword() {

    const alert = useAlert();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');

    const { error, loading, message } = useSelector(state => state.forgotPassword);

    useEffect(() => {

        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message);
        }

    }, [dispatch, alert, message, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email);

        dispatch(forgotPassword(formData));
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />

            <div class="row wrapper">
                <div class="col-10 col-lg-5">

                    {/** FORGOT PASSWORD FORM */}
                    <form class="shadow-lg bg-white" onSubmit={submitHandler}>
        
                        {/** TITLE OF FORM */}
                        <h1 class="mb-3">Forgot Password</h1>

                        {/** EMAIL TEXT INPUT */}
                        <div class="form-group">
                            <label for="email_field">Enter Email</label>
                            <input type="email" id="email_field" class="form-control" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>

                        {/** BUTTON TO SUBMIT CHANGES */}
                        <button id="forgot_password_button" type="submit" class="btn btn-block py-3" disabled={loading ? true : false}>
                            Send Email
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default ForgotPassword;