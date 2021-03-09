import React, { useState } from 'react';
import image from '../../assets/forgotpassword.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


export default function ForgotPassword() {
    const [userData, setUserData] = useState({
        email: ""
    });

    const {email} = userData;

    const handleChange = text => e => setUserData({...userData, [text]: e.target.value});

    const handleSubmit = e => {
        e.preventDefault();
        if(email) {
            axios.post('/users/forgotpassword', {email})
                .then(() => toast.success("Password reset link is sent"))
                .catch(err => toast.dark(err.response.statusText));
        } else {
            toast.error('Enter your email address');
        }
    }
    return (
        <div className='background' style={{paddingBottom: '3rem'}}>
            <ToastContainer/>
            <div className='background-flex login'>
                <div className='flex-register'>
                    <h2>Forgotten password</h2>
                    <p style={{textAlign: 'center', marginBottom: '2rem'}}>Insert your email to receive link to reset your password.</p>
                    <form className='flex-form' onSubmit={handleSubmit}>
                        <input
                            type='email'
                            value={email}
                            onChange={handleChange('email')}
                            placeholder='Email'
                            autoComplete="nope"
                        />
                        <input type='submit' value='Submit'/>
                    </form>
                </div>
                <img src={image} alt='forgotpassword'/>
            </div>
        </div>
    )
}
