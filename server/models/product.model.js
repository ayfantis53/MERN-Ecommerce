import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { 
        type: String, 
        required:[true, 'Please Enter product name'], 
        trim: true, 
        maxLength: [100, 'Product name cant exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please Enter product price'],
        maxLength: [5, 'Product Price cannot exceed 5 characters'],
        default: 0.0
    },
    description: { 
        type: String, 
        required:[true, 'Please Enter product description'], 
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select a category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select correct category for product'
        }
    },
    seller:{
        type: String,
        required: [true, 'Please Enter product seller']
   },
   stock:  {
        type: Number,
        required: [true, 'Please Enter product stock Number'],
        maxLength: [5, 'Product Stock cant exceed 5 characters'],
        default: 0
   },
   numOfReviews: {
        type: Number,
        default: 0
   },
   reviews: [
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        name: { type: String, required:true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true }
    }
   ],
   user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
   },
   createdAt: {
        type: Date,
        default: Date.now
   }
});

const Product = mongoose.model('Product', productSchema);

export default Product;