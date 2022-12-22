import ErrorHandler from '../utils/errorHandler.js';

export default (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;

    /** In Development error messages */
    if (process.env.NODE_ENV === 'development'){
        res.status(err.statuscode).json({ success: false, error: err, errMessage: err.message, stack: err.stack })
    }

    /** In Production error messages */
    if (process.env.NODE_ENV === 'production'){
        let error = { ...err };

        error.message = err.message || 'Internal Server Error';

        /** Wrong Mongoose Object ID Number */
        if (err.name == 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        /** Handling Mongoose Validation Error */
        if (err.name == 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        /** Handling Mongoose duplicate key errors */
        if (err.code === 11000) {
            const message = `Duplicate ${ Object.keys(err.keyValue) } entered`;
            error = new ErrorHandler(message, 400);
        }

        /** Handling wrong jwt error */
        if (err.name == 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try again';
            error = new ErrorHandler(message, 400);
        }

        /** Handling expired jwt error */
        if (err.name == 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try again';
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statuscode).json({ success: false, message: error.message });
    }

}