import User from '../models/user.model.js';

import jwt from 'jsonwebtoken';
import catchAsyncError from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";


/* @DESC   Checks if user is authenticated or not----------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
export const isAuthenticatedUser = catchAsyncError(async(req, res, next) => {
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login first to access this resource', 401));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
});

/* @DESC   handling Users roles ---------------------------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${ req.user.role }) is not allowed to access this resource`, 403));
        }

        next();
    }
}