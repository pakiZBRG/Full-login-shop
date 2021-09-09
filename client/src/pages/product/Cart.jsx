import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import { isAuth } from '../../helpers/auth';

function Cart() {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/users/${userId}`)
            .then(res => {
                setLoading(false);
                setCart(res.data.cart.items)
            })
            .catch(err => err.response && toast.dark(err.response.statusText));
    }, [userId]);
    
    const removeFromCart = btn => {
        let productId = btn.target.parentElement.firstChild.textContent
        const removeParent = btn.target.closest('section');
        axios.post(`/users/cart-delete/${userId}`, {productId})
            .then(res => {
                removeParent.parentNode.removeChild(removeParent);
                toast.success(res.data.message);
            })
            .catch(err => err.respons && toast.dark(err.response.statusText));
    }

    const clearCart = btn => {
        const removeParent = btn.target.closest('article');
        axios.post(`/users/clear-cart/${userId}`)
            .then(res => {
                removeParent.parentNode.removeChild(removeParent);
                toast.success(res.data.message)
            })
            .catch(err => err.response && toast.dark(err.response.statusText));
    }

    return (
        <div className='background' style={{paddingBottom: '3rem'}}>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            <div className='products-title'>
                <h1> Your Cart</h1>
            </div>
            {!loading ? 
                cart.length ? 
                <article className='cart'>
                    <button
                        className='default__btn'
                        style={{marginLeft: 'auto'}}
                        onClick={clearCart.bind(this)}
                    >
                        <i className='fa fa-trash'></i> Clear Cart
                    </button>
                    {cart.map(({product, quantity}) => {
                        if(product) {
                            return  (
                                <section className='cart__product' key={product._id}>
                                    <span style={{display: 'none'}}>{product._id}</span>
                                    <img src={product.imageUrl} height={'200px'} alt={product.title}/>
                                    <div className='cart__product--single width'>
                                        <h2 title={product.title}>{product.title.length > 20 ? `${product.title.substr(0, 19)}...` : product.title}</h2>
                                        <small>{product._id}</small>
                                    </div>
                                    <span className='divider'></span>
                                    <h3 className='cart__product--single'>${product.price} &times; {quantity}</h3>
                                    <span className='divider'></span>
                                    <h2 className='cart__product--single gold'>${(product.price * quantity).toFixed(2)}</h2>
                                    <div className='mobile__cart'>
                                        <h2>{product.title}</h2>
                                        <small>{product._id}</small>
                                        <div className='mobile__cart-inline'>
                                            <h3>${product.price} &times; {quantity}</h3>
                                            <span></span>
                                            <h2 className='gold'>${(product.price * quantity).toFixed(2)}</h2>
                                        </div>
                                    </div>
                                    <button title='Remove item' className='cart__product--remove' onClick={removeFromCart.bind(this)}>&times;</button>
                                </section>
                            )
                        }
                    })}
                    <button
                        className='default__btn'
                        style={{marginLeft: 'auto'}}
                    >
                        <Link to='/checkout' style={{textDecoration: 'none', color: '#2c0859'}}>
                            Checkout
                        </Link>
                    </button>
                </article> 
                    : 
                <h1 className='empty__cart'>Such emptiness :(</h1>
                :
            <h1 className='loading'>
                <i className='fa fa-shopping-cart'></i>
                <br/>Loading your cumbersome products
            </h1>
            }
        </div>
    )
}

export default Cart
