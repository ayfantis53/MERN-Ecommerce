import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import React, { Fragment, useState, useEffect } from 'react';

import MetaData from '../layouts/MetaData';
import { resetPassword, clearErrors } from '../../app/actions/userActions';


function ResetPassword() {

    const alert = useAlert();
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { error, success } = useSelector(state => state.forgotPassword);

    useEffect(() => {

        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Password Updated Successfully');
            navigate('/login');
        }

    }, [dispatch, navigate, alert, success, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(params.token, formData));
    }    

    return (
        <Fragment>
            <MetaData title={'New Password Reset'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/** NEW PASSWORD FORM */}
                    <form className="shadow-lg bg-white" onSubmit={submitHandler}>

                        {/** TITLE OF FORM */}
                        <h1 className="mb-3"> Reset Password </h1>

                        {/** PASSWORD TEXT INPUT */}
                        <div className="form-group">
                            <label htmlFor="password_field"> Password </label>
                            <input type="password" id="password_field" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        </div>

                        {/** CONFIRM PASSWORD TEXT INPUT */}
                        <div className="form-group">
                            <label htmlFor="confirm_password_field"> Confirm Password </label>
                            <input type="password" id="confirm_password_field" className="form-control" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        </div>

                        {/** BUTTON TO SUBMIT CHANGES */}
                        <button id="new_password_button" type="submit" className="btn btn-block py-3">
                            Set Password
                        </button>

                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default ResetPassword;