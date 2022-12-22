// node --experimental-json-modules about.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const products = require("./products.json");
//import products from './products.json' assert { type: 'json' };
import Product from '../../models/product.model.js';


/** Set location of dotenv file */
dotenv.config();
const app = express();

/** Connect to Database */
const mongoAtlasUrl = process.env.ATLAS_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(mongoAtlasUrl)
    .then(() => app.listenerCount(PORT, () => {{console.log(`Server listening on port ${PORT}`); }}))
    .catch((error) => console.log(error.message));

/** Populate database */
const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Previous products deleted');

        await Product.insertMany(products);
        console.log('Products are added');

        process.exit();
    } 
    catch(error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();