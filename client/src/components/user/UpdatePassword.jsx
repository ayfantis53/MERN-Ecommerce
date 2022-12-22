import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';

import MetaData from '../layouts/MetaData';
import { UPDATE_PASSWORD_RESET } from '../../app/constants/userConstants';
import { updatePassword, clearErrors } from '../../app/actions/userActions';


function UpdatePassword() {
    
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');

    const { isUpdated, error, loading } = useSelector(state => state.user);

    useEffect(() => {

        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('password updated successfully');

            navigate('/me');
            dispatch({ type: UPDATE_PASSWORD_RESET });
        }

    }, [dispatch, navigate, alert, isUpdated, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        dispatch(updatePassword(formData));
    };

    return (
        <Fragment>
            <MetaData title={'Change Password'} />

            <div classNameName="row wrapper">
                <div className="col-10 col-lg-5">

                    {/** UPDATE PASSWORD FORM */}
                    <form className="shadow-lg bg-white" onSubmit={submitHandler}>
                        
                        {/** TITLE OF FORM */}
                        <h1 className="mt-2 mb-5"> Update Password </h1>

                        {/** OLD PASSWORD TEXT INPUT */}
                        <div className="form-group">
                            <label htmlFor="old_password_field"> Old Password </label>
                            <input type="password" id="old_password_field" className="form-control" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                        </div>

                        {/** NEW PASSWORD TEXT INPUT */}
                        <div className="form-group">
                            <label htmlFor="new_password_field"> New Password </label>
                            <input type="password" id="new_password_field" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        </div>

                        {/** BUTTON TO SUBMIT CHANGES */}
                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3"  disabled={loading ? true : false}> Update Password </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default UpdatePassword;