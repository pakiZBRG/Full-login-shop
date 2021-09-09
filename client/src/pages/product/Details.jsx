import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { isAuth } from '../../helpers/auth';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

function Details(props) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const id = props.match.params.id;
    const [product, setProduct] = useState({});

    useEffect(() => {
        axios.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => toast.dark(err.response.statusText))
    }, [id]);

    const addToCart = product => {
        const productId = product.target.previousSibling.textContent;
        axios.post(`/users/cart/${userId}`, {productId})
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(err => err.response && toast.dark(err.response.data.message))
    }

    return (
        <div className='background'>
            <ToastContainer/>
            {product.user && 
                <div className='product'>
                    <h1 className='product--title'>{product.title}</h1>
                    <div className='product__details'>
                        <div className='product__details--img'>
                            <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.title}/>
                        </div>
                        <div className='product__details--content'>
                            <p className='creator'>
                                Created by: <Link to={`/user/${product.user._id}`}>{product.user.username}</Link>
                            </p>
                            <p className='description'>{product.description}</p>
                            <p className='price'>${product.price}</p>
                            <div>
                                <span style={{display: 'none'}}>{product._id}</span>
                                {isAuth() && userId !== product.user._id && 
                                    <button className='default__btn' onClick={addToCart.bind(this)}>
                                        <i className='fa fa-shopping-cart'></i> Add To Cart
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Details
