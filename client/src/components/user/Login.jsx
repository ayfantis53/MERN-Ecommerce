import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { login, clearErrors } from '../../app/actions/userActions';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const alert = useAlert();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
        
        if (error){
            alert.error(error);
                dispatch(clearErrors());
            }

    }, [dispatch, navigate, alert, redirect, isAuthenticated, error]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />

                    <div className="row wrapper"> 
                        <div className="col-10 col-lg-5">

                            {/** FORM TO LOGIN */}
                            <form className="shadow-lg bg-white" onSubmit={submitHandler}>
                                <h1 className="mb-3"> Login </h1>
                                <div className="form-group">
                                    <label htmlFor="email_field"> Email </label>
                                    <input type="email" id="email_field" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                {/** PASSWORD INPUT */}
                                <div className="form-group">
                                    <label htmlFor="password_field"> Password </label>
                                    <input type="password" id="password_field" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                {/** LINK TO DEAL WITH FORGOTTEN PASSWORD */}
                                <Link to="/pwd/forgot" className="float-right mb-4"> Forgot Password? </Link>

                                {/** BUTTON TO HANDLE LOGIN REQUEST*/}
                                <button id="login_button" type="submit" className="btn btn-block py-3">
                                    LOGIN
                                </button>

                                {/** LINK TO SIGN UP NEW USER */}
                                <Link to="/register" className="float-right mt-3"> New User? </Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login;