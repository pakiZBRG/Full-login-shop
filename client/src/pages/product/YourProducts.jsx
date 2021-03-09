import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {Link, Redirect} from 'react-router-dom';
import { isAuth } from '../../helpers/auth';

function YourProducts() {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/users/products/${userId}`, {userId})
            .then(res => {
                setLoading(false);
                setProducts(res.data.products)
            })
            .catch(err => toast.dark(err.response.statusText));
    }, []);

    const deleteProduct = (btn) => {
        let productId = btn.target.previousSibling.textContent;
        const removeParent = btn.target.closest('section');
        axios.post(`/products/${productId}`, {"userId": userId})
            .then(result => {
                toast.success(result.data.message);
                removeParent.parentNode.removeChild(removeParent);
            })
            .catch(err => err.response && toast.dark(err.response.statusText));
    }

    return (
        <div className='background'>
            <ToastContainer/>
            {!isAuth() && 
                <>
                    {toast.dark("Access denies to unauthorized users. Login or create account")}
                    <Redirect to='/'/>
                </>
            }
            <div className='products'>
                <div className='products-title'>
                    <h1>Your Products</h1>
                </div>
                <article className='products-flex'>
                    {!loading ? 
                        products.length ? 
                        products.map(product => {
                            return (
                                <section className='products-flex__single' key={product._id}>
                                    <img src={product.imageUrl} alt={product.title}/><br/>
                                    <div className='products-flex__single--padding'>
                                        <h2 title={product.title}>{product.title.length < 35 ? product.title : product.title.substr(0,34) +"..." }</h2>
                                        <p>${product.price}</p>
                                    </div>
                                    <div className='products-flex__buttons'>
                                        <span style={{display: 'none'}}>{product._id}</span>
                                        <button className='default__btn--small reverse' onClick={deleteProduct.bind(this)}>
                                            Delete
                                        </button>
                                        <Link className='default__btn--small reverse' to={`/edit/${product._id}`}>
                                            Edit
                                        </Link>
                                    </div>
                                </section>
                            );
                        }) : 
                        <h2 className='empty'>You have no products.<br/>Add your first product in <Link to='/add-product'>add product</Link> page</h2>
                            : 
                        <h1 className='loading'>
                            <i className='fa fa-archive'></i>
                            <br/>Loading your your cumbersome products
                        </h1>}
                </article>
            </div>
        </div>
    )
}

export default YourProducts
