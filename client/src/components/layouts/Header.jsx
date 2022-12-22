import { Fragment } from 'react';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Search from './Search';
import { logout } from '../../app/actions/userActions';

function Header() {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { cartItems } = useSelector(state => state.cart);
    const { user, loading } = useSelector(state => state.auth);

    const logoutHandler = () => {
        dispatch(logout());

        alert.success('Logged Out Successfully');
    }

    return (
        <Fragment>
            <nav className="navbar row">
                {/** BRAND LOGO IMAGE */}
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to='/'>
                            <img src="/images/logo.png" alt='logo' />
                        </Link>
                    </div>
                </div>

                {/** SEARCH BAR */}
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    {/** CART */}
                    <Link to='/cart' style={{ textDecoration: 'none' }}>
                        <span id="cart" className="ml-3"> Cart </span>
                        <span className="ml-1" id="cart_count"> {cartItems.length} </span>
                    </Link>

                    {user ? (
                            <div className="ml-4 dropdown d-inline">
                                {/** USER AVATAR PROFILE PIC */}
                                <Link to='#!' className='btn dropdown-toggle text-white mr-4' type='button' id='dropDownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    <figure className="avatar avatar-nav">
                                        <img src={user.avatar && user.avatar.url} alt={user && user.name} className='rounded-circle' />
                                    </figure>
                                    <span> {user && user.name} </span>
                                </Link>
                            
                                {/** DROPDOWN MENU */}
                                <div className="dropdown-menu" aria-labelledby='dropDownMenuButton'>
                                    {user && user.role !== 'admin' && (
                                        <Link to='/dashboard' className='dropdown-item'> Dashboard </Link>
                                    )}

                                    <Link to='/orders/me' className='dropdown-item'> Orders </Link>
                                    <Link to='/me' className='dropdown-item'> Profile </Link>
                                    <Link className='dropdown-item text-danger' to='/' onClick={logoutHandler}> Logout </Link>
                                </div>
                            </div>
                        ) : (
                        !loading &&  <Link to='/login' className="btn ml-4" id="login_btn"> Login </Link>
                    )}
                </div>
            </nav>
        </Fragment>
    )
}

export default Header;