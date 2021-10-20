import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'
import { isAuth } from '../../helpers/auth';
import { Redirect } from 'react-router-dom';

function Checkout({history}) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [items, setItems] = useState({});
    const [checkout, setCheckout] = useState({});
    const [loading, setLoading] = useState(true);

    const handleChange = text => e => setCheckout({...checkout, [text]: e.target.value});

    const submitHandler = e => {
        e.preventDefault();
        const {address, country, postalCode, city, shippingOption, paymentMethod} = checkout;
        if(address && country && postalCode && city && shippingOption && paymentMethod) {
            localStorage.removeItem("checkout");
            localStorage.setItem("checkout", JSON.stringify(checkout));
            history.push('/place-order');
        } else {
            toast.error("Please, fill in all the fileds");
        }
    }

    useEffect(() => {
        axios.get(`/users/${userId}`)
            .then(res => {
                setLoading(false);
                setItems(res.data.cart.items);
            })
            .catch(err => err.response && toast.dark(err.response.statusText));
    }, []);

    return (
        <div className='background' style={{paddingBottom: '4rem'}}>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            <h1 className='checkout__header'>Checkout</h1>
            <div className='flex-register full__width'>
                <div className='checkout__form'>
                    <form
                        className='flex-form padding'
                        onSubmit={submitHandler}
                    >
                        <div className="flex-form__flex">
                            <span>
                                <label>Country</label>
                                <input
                                    type='text'
                                    onChange={handleChange('country')}
                                />
                            </span>
                            <span>
                                <label>City</label>
                                <input
                                    type='text'
                                    onChange={handleChange('city')}
                                />
                            </span>
                        </div>

                        <div className="flex-form__flex">
                            <span>
                                <label>Postal Code</label>
                                <input
                                    type='number'
                                    onChange={handleChange('postalCode')}
                                />
                            </span>

                            <span>
                                <label>Address</label>
                                <input
                                    type='text'
                                    onChange={handleChange('address')}
                                />
                            </span>
                        </div>

                        <label>Payment method</label>
                        <div className='payment'>
                            <label className='payment__method'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value="payPal"
                                    onChange={handleChange('paymentMethod')}
                                />
                                <span><i className='fa fa-paypal'></i> PayPal</span>
                            </label>
                            <label className='payment__method'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value="Stripe"
                                    onChange={handleChange('paymentMethod')}
                                />
                                <span><i className='fa fa-cc-stripe'></i> Stripe</span>
                            </label>
                            <label className='payment__method'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value="By hand"
                                    onChange={handleChange('paymentMethod')}
                                />
                                <span><i className="fa fa-handshake-o"></i> By hand</span>
                            </label>
                            <label className='payment__method'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value="Paycheck"
                                    onChange={handleChange('paymentMethod')}
                                />
                                <span><i className='fa fa-credit-card'></i> Paycheck</span>
                            </label>
                        </div>

                        <label htmlFor="title">Shipping</label>
                        <div className='shipping'>
                            <label className='shipping__method'>
                                <input
                                    type='radio'
                                    name='shipping'
                                    value="Free shipping"
                                    onChange={handleChange('shippingOption')}
                                />
                                <span>Free Shipping (3-5 days)</span>
                            </label>
                            <label className='shipping__method'>
                                <input
                                    type='radio'
                                    name='shipping'
                                    value="Fast shipping"
                                    onChange={handleChange('shippingOption')}
                                />
                                <span>Fast Shipping (24h)</span>
                            </label>
                        </div>
                        
                        <div className='checkout--right'>
                            <label>Total:</label>
                            <span className='checkout--total'>${items[0] && items.reduce((a, c) => c.product.price * c.quantity + a, 0)}</span>
                        </div>
                        
                        <input type='submit' value='Proceed'/>
                    </form>
                </div>
                {items[0] &&
                    !loading ? 
                    <article className='checkout'>
                        {items.map(({product, quantity}) => {
                            if(product) {
                                return  (
                                    <section className='checkout__item' key={product._id}>
                                        <img src={product.imageUrl} height={'100px'} alt={product.title}/>
                                        <h2 title={product.title}>{product.title.length > 20 ? `${product.title.substr(0, 19)}...` : product.title}</h2>
                                        <div className='checkout__item--subtotal'>
                                            <div>
                                                <small>Price</small>
                                                <h3>${product.price}</h3>
                                            </div>
                                            <div>
                                                <small>Quantity</small>
                                                <h3>{quantity}</h3>
                                            </div>
                                        </div>
                                        <h1 className='checkout__item--total'>${(product.price * quantity).toFixed(2)}</h1>
                                    </section>
                                )
                            }
                        })}
                    </article> 
                        : 
                    <h1 className='loading'>
                        <i className='fa fa-shopping-bag'></i>
                        <br/>Loading your heavy bags
                    </h1>
                }
            </div>
        </div>
    )
}

export default Checkout
