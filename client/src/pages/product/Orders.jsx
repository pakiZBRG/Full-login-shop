import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { isAuth } from '../../helpers/auth';

function Orders() {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/users/order/${userId}`)
            .then(res => {
                setLoading(false)
                setOrders(res.data.doc)
            })
            .catch(err => toast.dark(err.response.statusText));
    }, [userId]);

    return (
        <div className='background' style={{paddingBottom: '3rem'}}>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            <h1 className='orders__title'>Orders</h1>
            <div className='orders'>
                {!loading ?
                    orders.length ? orders.map(order => (
                        <div key={order._id} className='orders__single'>
                            <h2 style={{marginBottom: '1rem'}}>{order._id}</h2>
                            {order.items.map(item => (
                                <Link to={`/products/${item.product._id}`} key={item._id} className='orders__single--product'>
                                    <small>{item.product.title}</small><br/>
                                    <small>${item.product.price} &times; {item.quantity}</small>
                                </Link>
                            ))}
                            <div className='orders__single--info'>
                                <span>
                                    <i className="fa fa-globe"></i> 
                                    <h4>{order.checkout.country}, {order.checkout.city}</h4>
                                </span>
                                <span>
                                    <i className="fa fa-calendar-check-o"></i> 
                                    <h4>{order.date.substring(5, order.date.length-7)}</h4>
                                </span>
                                <span>
                                    <i className='fa fa-money'></i>
                                    <h3>${order.items.reduce((a, c) => c.product.price * c.quantity + a, 0)}</h3>
                                </span>
                            </div>
                        </div>
                    )) : 
                    <h1 className='empty__cart'>No Orders</h1>
                        :
                    <h1 className='loading'>
                        <i className="fa fa-book"></i>
                        <br/>Extracting them orders
                    </h1>
                }
            </div>
        </div>
    )
}

export default Orders
