import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'
import { isAuth } from '../../helpers/auth';
import { Redirect } from 'react-router-dom';

function PlaceOrder({history}) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const checkout = JSON.parse(localStorage.getItem('checkout'));
    const date = new Date().toUTCString();
    const [items, setItems] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/users/${userId}`)
            .then(res => {
                setLoading(false);
                setItems(res.data.cart.items);
                setUser({
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email
                })
            })
            .catch(err => err.response && toast.dark(err.response.statusText));
    }, []);

    const orderItems = [];

    items[0] && items.map(({product, quantity}) => orderItems.push({'product': product._id, quantity}));

    const clearCart = () => {
        axios.post(`/users/clear-cart/${userId}`)
            .then(() => toast.success("Cart is cleared"))
            .catch(err => err.response && toast.dark(err.response.statusText));
    }

    const makeOrder = () => {
        const order = {
            user: user._id,
            items: orderItems,
            checkout,
            date
        }
        axios.post('/users/order', order)
            .then(() => {
                localStorage.removeItem('checkout');
                clearCart();
                history.push('/orders');
            })
            .catch(err => err.response && toast.dark(err.response.statusText))
    }



    return (
        <div className='background' style={{paddingBottom: '2rem'}}>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            {items[0] && user._id &&
                !loading ? 
                    <article className='place__order'>
                        <h1 className='place__order--title'>Your Order</h1>
                        {items.map(({product, quantity}) => (
                            <section key={product._id} className='place__order--item'>
                                <div className='place__order--item-image'>
                                    <img src={product.imageUrl} alt={product.title}/>
                                </div>
                                <div className='place__order--item-flex'>
                                    <span style={{width: '11rem'}}>
                                        <p>name</p>
                                        <h3>{product.title}</h3>
                                    </span>
                                    <div className='mobile__order'>
                                        <span style={{width: '6rem'}}>
                                            <p>price &times; quantity</p>
                                            <h3>${product.price} &times; {quantity}</h3>
                                        </span>
                                        <span className='divide'></span>
                                        <span style={{width: '4rem'}}>
                                            <p>subtotal</p>
                                            <h1>${product.price * quantity}</h1>
                                        </span>
                                    </div>
                                </div>
                            </section>
                        ))}
                        <section className='place__order--info'>
                            <div className='place__order--info-address'>
                                <span>
                                    <p>Name</p>
                                    <h1>{user.username}</h1>
                                </span>
                                <span>
                                    <p>Email</p>
                                    <h1>{user.email}</h1>
                                </span>
                                <span>
                                    <p>Country</p>
                                    <h1>{checkout.country}</h1>
                                </span>
                                <span>
                                    <p>City</p>
                                    <h1>{checkout.city}</h1>
                                </span>
                                <span>
                                    <p>Postal Code</p>
                                    <h1>{checkout.postalCode}</h1>
                                </span>
                                <span>
                                    <p>Address</p>
                                    <h1>{checkout.address}</h1>
                                </span>
                            </div>
                            <div className='place__order--info-payment'>
                                <span>
                                    <p>Payment</p>
                                    <h1>{checkout.paymentMethod}</h1>
                                </span>
                                <span>
                                    <p>Shipping</p>
                                    <h1>{checkout.shippingOption}</h1>
                                </span>
                                <span>
                                    <p>Date</p>
                                    <h1>{date.substring(4, date.length - 7)}</h1>
                                </span>
                                <span>
                                    <p>Total</p> 
                                    <h1>${items.reduce((a, c) => c.product.price * c.quantity + a, 0)}</h1>
                                </span>
                            </div>
                        </section>

                        <button
                            className='default__btn'
                            onClick={makeOrder}
                            style={{float: 'right'}}
                        >
                            Order
                        </button>
                    </article>
                        :
                    <h1 className='loading'>
                        <i className='fa fa-money'></i>
                        <br/>Preparing your departure
                    </h1>
            }
        </div>
    )
}

export default PlaceOrder
