import React, {useState, useEffect} from 'react';
import { isAuth } from '../../helpers/auth';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import bgImage from '../../assets/editProduct.jpg';
import axios from 'axios';

function EditProduct({match}) {
    const prodId = match.params.id;
    const [image, setImage] = useState('');
    const [product, setProduct] = useState({});

    useEffect(() => {
        axios.get(`/products/${prodId}`)
            .then(res => setProduct(res.data))
            .catch(err => err.reponse && toast.dark(err.response.statusText))
    }, []);

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
        if(title && price && description && imageUrl){
            const form = new FormData();
            form.append("title", title);
            form.append("price", price);
            form.append("description", description);
            form.append("myImage", imageUrl);
            axios.patch(`/products/${product._id}`, form)
                .then(res => {
                    toast.success(res.data.message);
                })
                .catch(err => toast.dark(err.response.data.err));
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
                    <h2>Edit Product</h2>
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
                            <div id='target'>
                                <img id="target" src={`http://localhost:5000/${imageUrl}`} alt={title}/>
                                <label className="custom-file-input onHover">
                                    <input type="file" name='myImage' onChange={onImageChange}/>
                                </label>
                            </div>
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

                        <input type='submit' value='Update'/>
                    </form>
                </div>
                <div className='edit-product-bg'>
                    <img src={bgImage} alt='edit-product'/>
                </div>
            </div>
        </div>
    )
}

export default EditProduct
