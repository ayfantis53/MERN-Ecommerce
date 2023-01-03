import crypto from 'crypto';
import cloudinary from 'cloudinary';

import User from "../models/user.model.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from '../utils/sendEmail.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middleware/catchAsyncError.js';


/* @DESC   Admin Route Get all users ---------------------------------------------------------------------
*  @ROUTE  GET user/admin
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getAllUsers = catchAsyncError(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({ success: true, users });
});

/* @DESC   Admin Route Get users details ------------------------------------------------------------------
*  @ROUTE  GET user/admin/:id
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getUserDetails = catchAsyncError(async(req, res, next) => {
    const user = await User.findbyId(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${ req.params.id }`));
    }

    res.status(200).json({ success: true, user });
});

/* @DESC   Admin Update user profile --------------------------------------------------------------------
*  @ROUTE  PUT user/admin/:id
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const UpdateUser = catchAsyncError(async(req, res, next) => {
    const newUserData = { name: req.body.name, email: req.body.email, role: req.body.role };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindandModify: false });

    res.status(200).json({ success:true });
});

/* @DESC   Admin Route Delete use ------------------------------------------------------------------------
*  @ROUTE  GET user/admin/:id
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const DeleteUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findbyId(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${ req.params.id }`));
    }

    /** Remove avatar from cloudinary */
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await User.remove();

    res.status(200).json({ success: true });
});


/* @DESC   Get currently logged in User details ----------------------------------------------------------
*  @ROUTE  GET user/me
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const getUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user });
});

/* @DESC   Update/Change user profile --------------------------------------------------------------------
*  @ROUTE  PUT user/me
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const updateProfile = catchAsyncError(async(req, res, next) => {
    const newUserData = { name: req.body.name, email: req.body.email };

    /** Update Avatar */
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id);

        const image_id = user.avatar.public_id;
        res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });

        newUserData.avatar = { public_id: result.public_id, url: result.secure_url }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindandModify: false });

    res.status(200).json({ success:true });
});

/* @DESC   Register a new User ----------------------------------------------------------------------------
*  @ROUTE  POST user/
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const registerUser = catchAsyncError(async(req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    });

    console.log( JSON.stringify( result ) );

    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password, avatar: {public_id: result.public_id, url: result.secure_url }});

    res.status(201).json({success:true, user})
    sendToken(user, 200, res);
});

/* @DESC   Authenticate a User-----------------------------------------------------------------------------
*  @ROUTE  POST user/login
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const loginUser = catchAsyncError(async(req, res, next) => {
    const { email, password } = req.body;

    /** Checks if email and password is entered by the user */
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    /** Find User is database */
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    /** Check if password is valid */
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

/* @DESC   Forgot password -------------------------------------------------------------------------------
*  @ROUTE  POST user/pwd/forgot
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const forgotPassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    /** Get reset token */
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    /** Create Reset password url */
    const resetUrl = `${req.protocol}://${req.get('host')}/pwd/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;
    try {
        await sendEmail({ email: user.email, subject: 'eCommerce Password Recovery', message });

        res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('User not found with this email', 404));
    }
});

/* @DESC   Reset password -------------------------------------------------------------------------------
*  @ROUTE  POST user/pwd/reset/:token
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const resetPassword = catchAsyncError(async(req, res, next) => {

    /** Hash URL token */
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400)); 
    }
    if(req.body.password !== req.body.confimPassword){
        return next(new ErrorHandler('Password does not match', 400)); 
    }

    /** Setup new password */
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);

});

/* @DESC   Update/Change password -------------------------------------------------------------------------
*  @ROUTE  PUT user/pwd/update
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const updatePassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    /** Check previous user password */
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old Password is not correct'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

/* @DESC   Logout a User ----------------------------------------------------------------------------------
*  @ROUTE  POST user/logout
*  @ACCESS public  
*---------------------------------------------------------------------------------------------------------*/
export const logoutUser = catchAsyncError(async(req, res, next) => {
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });

    res.status(200).json({ success: true, message: 'Logged Out' });
});

