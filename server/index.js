import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import errorMiddleware from './middleware/errors.js'
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import paymentRoutes from './routes/payment.routes.js';


/** Set location of dotenv file */
dotenv.config();
const app = express();

/** Middleware */
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));

/** Setting up cloudinary Config */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

app.use(errorMiddleware);
app.use('/user', userRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/products', productRoutes);

/** Connect to Database */
const mongoAtlasUrl = process.env.ATLAS_URL;
const ENV = process.env.NODE_ENV; 
const PORT = process.env.PORT || 5000;

mongoose.connect(mongoAtlasUrl)
    .then(() => app.listen(PORT, () => {console.log(`Server listening on port ${PORT} in ${ENV} mode`); }))
    .catch((error) => console.log(error.message));