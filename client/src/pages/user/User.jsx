import React, { useState, useEffect } from 'react';
import { isAuth } from '../../helpers/auth';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom'
import cookie from 'js-cookie';


export default function User({match}) {
    const id = match.params.userId;
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    const token = cookie.get('token');
    const loggedUser = localStorage.getItem('user');
    
    useEffect(() => {
        let _isMounted = true;
        if(token || loggedUser){
            axios.get(`/users/${id || userId}`)
                .then(res => {
                    if(_isMounted){
                        setLoading(false);
                        setUserData(res.data);
                    }
                })
                .catch(err => err.response && toast.dark(err.response.statusText));
        }

        return () => _isMounted = false;
    }, [match.params]);

    const { _id, username, email } = userData;

    return (
        <div className='background'>
            <ToastContainer/>
            {isAuth() && 
                !loading ? 
                userData.username ?
                <div className='background-flex login' style={{marginTop: '4rem'}}>
                    <div className='flex-register'>
                        <h2>Name: <span style={{color: 'crimson'}}>{username}</span></h2>
                        <h2>Email: <span style={{color: 'crimson'}}>{email}</span></h2>
                        <h2>Id: <span style={{color: 'crimson'}}>{_id}</span></h2>
                    </div>
                </div>
                    :
                <div className="background-white">
                    <div className='background-login'>
                        <h2>Access denied to unauthorized users</h2>
                        <Link to='/login'>
                            <button  className='default__btn'><i className='fa fa-user' style={{marginRight: '0.4rem'}}/>Login</button>
                        </Link>
                        <Link to='/register'>
                            <button  className='default__btn'><i className='fa fa-user-plus' style={{marginRight: '0.4rem'}}/>Register</button>
                        </Link>
                    </div>
                </div>
                :
                <h1 className='loading'>
                    <i className='fa fa-folder-open'></i>
                    <br/>Grabbing user data from my files
                </h1>
            }
        </div>
    )
}