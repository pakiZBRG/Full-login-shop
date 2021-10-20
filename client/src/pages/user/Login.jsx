import React, { useState } from 'react';
import image from '../../assets/login.jpg';
import axios from 'axios';
import { authenticate, googleAuth, isAuth } from '../../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';


export default function Login({history}) {
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const handleChange = text => e => setUserData({...userData, [text]: e.target.value});
    
    const {email, password} = userData;

    const handleSubmit = e => {
        e.preventDefault();
        if(email && password) { 
            axios.post('/users/login', {email ,password})
                .then(res => {
                    authenticate(res, () => {
                        setUserData({
                            ...userData,
                            email: "",
                            password: ""
                        });
                    });
                    if(isAuth()){
                        history.push(`/user/${res.data.user.id}`);
                    }
                })
                .catch(err => toast.error(err.response.data.error));
        } else {
            toast.error('Please fill all fields');
        }
    }

    //Google Login
    const sendGoogleToken = tokenId => {
        axios.post('users/googlelogin', {idToken: tokenId})
            .then(res => redirectUser(res))
            .catch(err => console.log(err.data))
    };
    const responseGoogle = response => sendGoogleToken(response.tokenId);

    //Redirect logged user via soacial media to his profile
    const redirectUser = res => {
        googleAuth(res, () => {
            isAuth() && history.push(`/user/${res.data.user._id}`)
        });
    }

    return (
        <div className='background' style={{paddingBottom: '3rem'}}>
            {isAuth() ? <Redirect to='/'/> : null}
            <ToastContainer/>
            <div className='background-flex login'>
                <div className='flex-register'>
                    <h2>Login</h2>
                    <form className='flex-form' onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label htmlFor="email">Email</label>
                            <input
                                type='email'
                                value={email}
                                onChange={handleChange('email')}
                                name='email'
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                value={password}
                                onChange={handleChange('password')}
                                name='password'
                            />
                        </div>
                        <input type='submit' value='Login'/>
                        <Link to='/forgotpassword' className='forgot-password'>Forgot password?</Link>
                    </form>
                    <span className='separator'><p style={{margin: '2.5rem 0'}}>or</p></span>
                    <Link to='/register' className='login-btn' style={{fontWeight: 'bold'}}>
                        <i className='fa fa-user-plus' style={{marginRight: '0.5rem'}}></i>Create an account
                    </Link>
                    <GoogleLogin
                        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className='login-btn google'
                            >
                                <i className='fa fa-google' style={{marginRight: '0.5rem'}}></i>Login with Google
                            </button>
                        )}
                    />
                </div>
                <img src={image} alt='login'/>
            </div>
        </div>
    )
}
