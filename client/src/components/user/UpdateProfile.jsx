import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useState, useEffect } from 'react';

import MetaData from '../layouts/MetaData';
import { UPDATE_PROFILE_RESET } from '../../app/constants/userConstants';
import { updateProfile, loadUser, clearErrors } from '../../app/actions/userActions';


function UpdateProfile() {

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    const { user } = useSelector(state => state.auth);
    const { isUpdated, error, loading } = useSelector(state => state.user);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        
        if (error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('user updated successfully');
            dispatch(loadUser());

            navigate('/me');
            dispatch({ type: UPDATE_PROFILE_RESET });
        }

    }, [dispatch, navigate, user, alert, isUpdated, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);

        dispatch(updateProfile(formData));
    };

    const onChange = (e) => {

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
        
    }
    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/** UPDATE PASSWORD FORM */}
                    <form className="shadow-lg bg-white" onSubmit={submitHandler} encType='multipart/form-data'>

                        {/** TITLE OF FORM */}
                        <h1 className="mt-2 mb-5"> Update Profile </h1>

                        {/** NAME TEXT INPUT */}
                        <div className="form-group">
                            <label for="name_field"> Name </label>
                            <input type="name" id="name_field" className="form-control" name='name' value={name} onChange={(e) => {setName(e.target.value)}} />
                        </div>

                        {/** EMAIL TEXT INPUT */}
                        <div className="form-group">
                            <label for="email_field"> Email </label>
                            <input type="email" id="email_field" className="form-control" name='email' value={email} onChange={(e) => {setEmail(e.target.value)}} />
                        </div>

                        <div className='form-group'>

                            {/** AVATAR PICTURE UPLOAD */}
                            <label htmlFor='avatar_upload'> Avatar </label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img src={avatarPreview} className='rounded-circle' alt='Avatar Preview' />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input type='file' name='avatar' className='custom-file-input' id='customFile' accept='image/*' onChange={onChange} />
                                    <label className='custom-file-label' htmlFor='customFile'> Choose Avatar </label>
                                </div>
                            </div>
                        </div>

                        {/** BUTTON TO SUBMIT CHANGES */}
                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false}> 
                            Update 
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile;