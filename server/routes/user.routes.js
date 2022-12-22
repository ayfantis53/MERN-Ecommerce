import express from 'express';

import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js';
import { getAllUsers, getUserDetails, UpdateUser, DeleteUser, getUser, updateProfile, registerUser, loginUser, forgotPassword, resetPassword, updatePassword, logoutUser } from '../controllers/user.controllers.js';


const router = express.Router();

router.route('/admin').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);
router.route('/admin/:id').get(isAuthenticatedUser, authorizedRoles('admin'), getUserDetails);
router.route('/admin/:id').put(isAuthenticatedUser, authorizedRoles('admin'), UpdateUser);
router.route('/admin/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), DeleteUser);

router.route('/me').get(isAuthenticatedUser, getUser);
router.route('/me').put(isAuthenticatedUser, updateProfile);

router.route('/register').post(registerUser);

router.route('/pwd/forgot').post(forgotPassword);
router.route('/pwd/reset/:token').post(resetPassword);
router.route('/pwd/update').put(isAuthenticatedUser, updatePassword);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);


export default router;