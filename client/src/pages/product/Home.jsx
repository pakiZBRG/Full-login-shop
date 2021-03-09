import React, { useState, useEffect } from 'react';
import { isAuth } from '../../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home({match}) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [userData, setUserData] = useState({
        username: "",
        email: ""
    });

    useEffect(() => {
        if(localStorage.length > 0){
            axios.get(`/users/${userId}`)
                .then(res => {
                    setUserData({
                        id: res.data._id,
                        username: res.data.username,
                        email: res.data.email
                    })
                })
                .catch(err => err.response && toast.dark(err.response.statusText));
        }
    }, [match.params]);

    const {username, id} = userData;

    return (
        <div className='background'>
            <ToastContainer/>
            <div className='background-white'>
                {isAuth() ?
                    <div className='background-login'>
                        <h2>You are currently logged in, <span style={{color: 'crimson'}}>{username}</span></h2>
                        <Link to={`/user/${id}`}>
                            <button className='default__btn'>
                                <i className='fa fa-user' style={{marginRight: '0.4rem'}}></i>Profile
                            </button>
                        </Link>
                        <Link to={`/products`}>
                            <button className='default__btn'>
                                <i className='fa fa-shopping-bag' style={{marginRight: '0.4rem'}}></i>Shop
                            </button>
                        </Link>
                    </div>
                        :
                    <div className='background-login'>
                        <h2>Login or Register to access our content!</h2>
                        <Link to='/login'>
                            <button className='default__btn'>
                                <i className='fa fa-user' style={{marginRight: '0.4rem'}}></i>Login
                            </button>
                        </Link>
                        <Link to='/register'>
                            <button className='default__btn'>
                                <i className='fa fa-user-plus' style={{marginRight: '0.4rem'}}></i>Register
                            </button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}
