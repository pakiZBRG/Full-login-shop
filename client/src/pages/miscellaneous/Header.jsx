import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { isAuth, signout } from '../../helpers/auth';

function Header({history}) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [mobile, setMobile] = useState(false);
    const current = window.location.pathname;
    const isActive = path => current === path ? 'activeLink' : '';

    const toggleNav = () => setMobile(!mobile);
    const closeNav = () => setMobile(false);

    return (
        <>
            {/* TYPICAL HEADER */}
            <header className='link-header'>
                <ToastContainer/>
                <nav>
                    <ul>
                        <div className='link-headers__links'>
                            <li><Link to='/' className={`link ${isActive('/')}`}>Home</Link></li>
                            <li><Link to='/products' className={`link ${isActive('/products')}`}>Products</Link></li>
                            {isAuth() &&
                                <>
                                    <li><Link to='/add-product' className={`link ${isActive('/add-product')}`}>Add product</Link></li>
                                    <li><Link to='/your-products' className={`link ${isActive('/your-products')}`}>Your products</Link></li>
                                </>
                            }
                        </div>
                        {isAuth() ? 
                            <>
                                <div className='link-headers__links'>
                                    <li>
                                        <Link to={`/user/${userId}`} className={`link ${isActive(`/user/${userId}`)}`}>
                                            <i className='fa fa-user'></i> Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/cart' className={`link ${isActive('/cart')}`}>
                                            <i className="fa fa-shopping-cart"></i> Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/orders' className={`link ${isActive('/orders')}`}>
                                        <i className="fa fa-newspaper-o"></i> Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                signout(() => history.push('/'));
                                                toast.success("See you soon")
                                            }}
                                            className='default__btn--small'
                                        >
                                            <i className='fa fa-sign-out' style={{marginRight: '0.4rem'}}/>Signout
                                        </button>
                                    </li>
                                </div>
                            </>
                            :
                            <div className='link-headers__buttons'>
                                <li>
                                    <Link to='/login'>
                                        <button className='default__btn--small'>
                                            <i className='fa fa-user' style={{marginRight: '0.4rem'}}></i>Login
                                        </button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/register'>
                                        <button className='default__btn--small'>
                                            <i className='fa fa-user-plus' style={{marginRight: '0.4rem'}}></i>Register
                                        </button>
                                    </Link>
                                </li>
                            </div>
                        }
                    </ul>
                </nav>
            </header>
            {/* MOBILE HEADER */}
            <header className='mobile-header'>
                <ToastContainer/>
                <nav>
                    <ul>
                        <div className='mobile-header__links'>
                            <li><Link to='/' className={`link ${isActive('/')}`}>Home</Link></li>
                            <li><Link to='/products' className={`link ${isActive('/products')}`}>Products</Link></li>
                            {isAuth() &&
                                <>
                                    <li><Link to='/add-product' className={`link disappear ${isActive('/add-product')}`}>Add product</Link></li>
                                    <li><Link to='/your-products' className={`link disappear ${isActive('/your-products')}`}>Your products</Link></li>
                                </>
                            }
                        </div>
                        <div className='mobile-header__links'>
                            <button className='default__btn--small' onClick={toggleNav}>
                                Menu
                            </button>
                        </div>
                    </ul>
                </nav>
            </header>
            {/* ENLARGED MOBILE HEADER */}
            {mobile && <div className='overlay'>
                <div className='mobile-view'>
                    <span className='close' onClick={toggleNav}>&times;</span>
                    {isAuth() ? 
                        <>
                            <div className='mobile-view__flex'>
                                <div className='mobile-view__links'>
                                    <li>
                                        <Link to='/' className={`link ${isActive('/')}`} onClick={closeNav}>Home</Link>
                                    </li>
                                    <li>
                                        <Link to='/products' className={`link ${isActive('/products')}`}  onClick={closeNav}>Products</Link>
                                    </li>
                                    {isAuth() &&
                                        <div>
                                            <li style={{marginBottom: '3rem'}}>
                                                <Link to='/add-product' className={`link ${isActive('/add-product')}`} onClick={closeNav}>Add product</Link>
                                            </li>
                                            <li>
                                                <Link to='/your-products' className={`link ${isActive('/your-products')}`} onClick={closeNav}>Your products</Link>
                                            </li>
                                        </div>
                                    }
                                </div>
                                <div className='mobile-view__links'>
                                    <li>
                                        <Link to={`/user/${userId}`} className={`link ${isActive(`/user/${userId}`)}`} onClick={closeNav}>
                                            <i className='fa fa-user'></i> Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/cart' className={`link ${isActive('/cart')}`} onClick={closeNav}>
                                            <i className="fa fa-shopping-cart"></i> Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/orders' className={`link ${isActive('/orders')}`} onClick={closeNav}>
                                            <i className="fa fa-newspaper-o"></i> Orders
                                        </Link>
                                    </li>
                                </div>
                            </div>
                            <li style={{display: 'flex', justifyContent: 'center'}}>
                                <button
                                    onClick={() => {
                                        signout(() => history.push('/'));
                                        closeNav()
                                        toast.success("See you soon");
                                    }}
                                    className='default__btn'
                                >
                                    <i className='fa fa-sign-out' style={{marginRight: '0.4rem'}}/>Signout
                                </button>
                            </li>
                        </>
                        :
                        <div className='mobile-view__buttons'>
                            <li>
                                <Link to='/' className={`link ${isActive('/')}`}  onClick={closeNav}>Home</Link>
                            </li>
                            <li>
                                <Link to='/products' className={`link ${isActive('/products')}`}  onClick={closeNav}>Products</Link>
                            </li>
                            <div style={{display: 'flex', flexDirection: "row"}}>
                                <li style={{margin: '1rem'}}>
                                    <Link to='/login' onClick={closeNav}>
                                        <button className='default__btn--small'>
                                            <i className='fa fa-user' style={{marginRight: '0.4rem'}}></i>Login
                                        </button>
                                    </Link>
                                </li>
                                <li style={{margin: '1rem'}}>
                                    <Link to='/register' onClick={closeNav}>
                                        <button className='default__btn--small'>
                                            <i className='fa fa-user-plus' style={{marginRight: '0.4rem'}}></i>Register
                                        </button>
                                    </Link>
                                </li>
                            </div>
                        </div>
                    }
                </div>
            </div>}
        </>
    )
}

export default Header
