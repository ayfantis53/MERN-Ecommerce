import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loadUser } from '../app/actions/userActions';


function ProtectedRoute({ children, isAdmin, }) {

    const dispatch = useDispatch();
    const { isAuthenticated = false, loading = true, user } = useSelector(state => state.auth);

    useEffect(() => {
        if(!user) {
            dispatch(loadUser())
        }
    }, [isAuthenticated, dispatch, user, loading])

    if(loading) return <h1> loading... </h1>

    if (!loading && isAuthenticated) {
        if(isAdmin === true && user.role !== 'admin') {
            return <Navigate to='/' />
        }
        
        return children;    
    }
    else {
        return <Navigate to={'/login'} />
    }
};

export default ProtectedRoute;