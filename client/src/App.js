import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import store from './app/store';
import { loadUser } from './app/actions/userActions';
import { Dashboard, ProductsList, NewProduct, UpdateProduct, UpdateUser, ProcessOrder, UsersList, ProductReviews, OrdersList, Cart, Payment, Shipping, ConfirmOrder, OrderSuccess, ListOrders, OrderDetails, Home, ProtectedRoute, Footer, Header, ProductDetails, Login, Profile, Register, ResetPassword, UpdateProfile,UpdatePassword, ForgotPassword } from './components/_index';


function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');
  
  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripApiKey() {
      const { data } = await axios.get('http://localhost:5000/payment/stripeapi');

      setStripeApiKey(data.stripeApiKey);
    };

    getStripApiKey();

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  return (
      <Router>
          <Header />

          <div className="">        
            <Routes>
    
                  <Route path='/' element={<Home />}/>
                  <Route path='/search/:keyword' element={<Home />}/>
                  <Route path='/products/:id' element={<ProductDetails />}/>

                  <Route path='/cart' element={<Cart />}/>
                  <Route path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>}/>
                  <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>}/>
                  <Route path='/order/success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}/>
                  {stripeApiKey &&
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Route path='/payment' element={<ProtectedRoute><Payment /></ProtectedRoute>}/>
                    </Elements>
                  }

                  <Route path='/login' element={<Login />}/>
                  <Route path='/register' element={<Register />}/>
                  <Route path='/pwd/forgot' element={<ForgotPassword />}/>
                  <Route path='/pwd/reset/:token' element={<ResetPassword />}/>
                  <Route path='/me' element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
                  <Route path='/me/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
                  <Route path='/pwd/update' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}/>

                  <Route path='/orders/me' element={<ProtectedRoute><ListOrders /></ProtectedRoute>}/>
                  <Route path='/orders/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}/>

                  <Route path='/dashboard' isAdmin={true} element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                  <Route path='/admin/products' isAdmin={true} element={<ProtectedRoute><ProductsList /></ProtectedRoute>}/>
                  <Route path='/admin/product' isAdmin={true} element={<ProtectedRoute><NewProduct /></ProtectedRoute>}/>
                  <Route path='/admin/product/:id' isAdmin={true} element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>}/>

                  <Route path='/admin/orders' isAdmin={true} element={<ProtectedRoute><OrdersList /></ProtectedRoute>}/>
                  <Route path='/admin/orders/:id' isAdmin={true} element={<ProtectedRoute><ProcessOrder /></ProtectedRoute>}/>
                  <Route path='/admin/users' isAdmin={true} element={<ProtectedRoute><UsersList /></ProtectedRoute>}/>
                  <Route path='/admin/user/:id' isAdmin={true} element={<ProtectedRoute><UpdateUser /></ProtectedRoute>}/>
                  <Route path='/admin/reviews' isAdmin={true} element={<ProtectedRoute><ProductReviews /></ProtectedRoute>}/>

            </Routes>

            {!loading && (!isAuthenticated || user.role !== 'admin') && (
                    <Footer />
            )}
          </div>

      </Router>
  );
}

export default App;
