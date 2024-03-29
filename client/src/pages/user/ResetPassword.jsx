import React, { useState, useEffect } from 'react';
import image from '../../assets/resetpassword.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default function ResetPassword({match}) {
    const [userData, setUserData] = useState({
        password: "",
        passwordConfirm: "",
        token: ""
    });
    
    const { password, passwordConfirm, token } = userData;
    useEffect(() => {
        let token = match.params.token;
        if(token){
            setUserData({ ...userData, token });
        }
    }, [])

    const handleChange = text => e => setUserData({...userData, [text]: e.target.value});

    const handleSubmit = e => {
        e.preventDefault();
        if((password === passwordConfirm) && passwordConfirm && password){
            axios.put('/users/resetpassword', {
                newPassword: password,
                resetPasswordLink: token
            })
            .then(res => {
                setUserData({ 
                    ...userData,
                    password: "",
                    passwordConfirm: ''
                });
                toast.success(res.data.message);
            })
            .catch(err => toast.error(err.response.data.error));
        } else {
            toast.error('Passwords don\'t match');
        }
    }
    return (
        <div className='background'>
            <ToastContainer/>
            <div className='background-flex login'>
                <div className='flex-register'>
                    <h2>Reset password</h2>
                    <form className='flex-form' onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                value={password}
                                onChange={handleChange('password')}
                                name='Password'
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type='password'
                                value={passwordConfirm}
                                onChange={handleChange('passwordConfirm')}
                                name='confirmPassword'
                            />
                        </div>
                        <input type='submit' value='Submit'/>
                    </form>
                    <span className='separator'><p style={{margin: '2.5rem 0'}}>or</p></span>
                    <Link to='/login' className='login-btn' style={{fontWeight: 'bold'}}>
                        <i className='fa fa-user' style={{marginRight: '0.5rem'}}></i>Login
                    </Link>
                </div>
                <img src={image} alt='forgotpassword'/>
            </div>
        </div>
    )
}
