import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../../assets/addproduct.png';
import { isAuth } from '../../helpers/auth';
import { toast, ToastContainer } from 'react-toastify';

function AddProduct() {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [image, setImage] = useState('');
    const [product, setProduct] = useState({
        title: "",
        price: 0,
        description: "",
        imageUrl: {},
        user: userId
    });
    
    const handleChange = text => e => setProduct({...product, [text]: e.target.value});

    /* FILE SELECTION */
    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setProduct({...product, imageUrl: e.target.files[0]})
            setImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const {title, price, description, imageUrl} = product;

    const handleSubmit = e => {
        e.preventDefault();
        console.log(product);
        if(title && price && description && imageUrl.name){
            const form = new FormData();
            form.append("title", title);
            form.append("price", price);
            form.append("description", description);
            form.append("myImage", imageUrl);
            form.append("user", userId);
            axios.post('/products', form)
                .then(res => {
                    setProduct({
                        title: "",
                        price: 0,
                        description: "",
                        imageUrl: {},
                        user: ""
                    })
                    toast.success(res.data.message);
                })
                .catch(err => toast.dark(err.response.statusText));
        } else {
            toast.error('Please fill all fields');
        }
    }
    
    return (
        <div className='background' style={{paddingBottom: '1rem'}}>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            <div className='background-flex login'>
                <div className='flex-register'>
                    <h2>Create a Product</h2>
                    <form
                        className='flex-form'
                        method="POST"
                        encType='multipart/form-data'
                        onSubmit={handleSubmit}
                    >
                        <label htmlFor="title">Title</label>
                        <input
                            type='text'
                            value={title}
                            onChange={handleChange('title')}
                        />

                        <label htmlFor="price">Price</label>
                        <input
                            type='number'
                            step='.01'
                            value={price}
                            onChange={handleChange('price')}
                        />

                        {/* FILE SELECTION */}
                        {!image &&
                            <label className="custom-file-input">
                                <input type="file" name='myImage' onChange={onImageChange}/>
                            </label>
                        }
                        {image && 
                            <div id='target'>
                                <img id="target" src={image} alt={title}/>
                                <label className="custom-file-input onHover">
                                    <input type="file" name='myImage' onChange={onImageChange}/>
                                </label>
                            </div>
                        }

                        <label htmlFor="description">Description</label>
                        <textarea
                            rows='5'
                            type='text'
                            value={description}
                            onChange={handleChange('description')}
                        ></textarea>

                        <input type='submit' value='Create'/>
                    </form>
                </div>
                <div className='add-product-bg'>
                    <img src={bgImage} alt='add-product'/>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
