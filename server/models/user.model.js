import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import validator from 'validator';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please Enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    avatar: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

/* @DESC   Encrypt password before saving user-------------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

/* @DESC   Compare user password---------------------------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/* @DESC   Return JWT token--------------------------------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });
};

/* @DESC   Generate password reset token-------------------------------------------------------------------
*  @ROUTE  User
*---------------------------------------------------------------------------------------------------------*/
userSchema.methods.getResetPasswordToken = function () {
    /** Generate the token */
    const resetToken = crypto.randomBytes(20).toString('hex');

    /** Has and set to resetPasswordToken */
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    /** Set token expire time */
    this.resetPasswordExpire = Date.now() + 30 *60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

export default User;