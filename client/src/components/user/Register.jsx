import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';

import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { register, clearErrors } from '../../app/actions/userActions';


function Register() {

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState('');
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    const { name, email, password } = user;
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        
        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, navigate, alert, isAuthenticated, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(register(formData));
    }

    const onChange = (e) => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    return (
        <Fragment>
            {loading ? <Loader /> : ( 
                <Fragment>
                    <MetaData title={'Register User'} />

                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            {/** FORM FOR REGISTRATION */}
                            <form className="shadow-lg bg-white" onSubmit={submitHandler} encType='multipart/form-data'>

                                <h1 className="mb-3">Register</h1>

                                {/** NAME INPUT */}
                                <div className="form-group">
                                    <label htmlFor="email_field">Name</label>
                                    <input type="name" id="name_field" className="form-control" name='name' value={name} onChange={onChange}/>
                                </div>

                                {/** EMAIL INPUT */}
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input type="email" id="email_field" className="form-control" name='email' value={email} onChange={onChange}/>
                                </div>
                        
                                {/** PASSWORD INPUT */}
                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input type="password" id="password_field" className="form-control" name='password' value={password} onChange={onChange}/>
                                </div>

                                {/** AVATAR INPUT */}
                                <div className='form-group'>
                                    <label htmlFor='avatar_upload'>Avatar</label>
                                    <div className='d-flex align-items-center'>
                                        <div>
                                            <figure className='avatar mr-3 item-rtl'>
                                                <img src={avatarPreview} className='rounded-circle' alt='Avatar Preview' />
                                            </figure>
                                        </div>

                                        <div className='custom-file'>
                                            <input type='file' name='avatar' className='custom-file-input' id='customFile' accept='images/*' onChange={onChange}/>
                                            <label className='custom-file-label' htmlFor='customFile'>
                                                Choose Avatar
                                            </label>
                                        </div>
                                    </div>
                                </div>
                        
                                {/** REGISTER BUTTON */}
                                <button id="register_button" type="submit" className="btn btn-block py-3" disabled={loading ? true : false}> 
                                    REGISTER 
                                </button>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Register;