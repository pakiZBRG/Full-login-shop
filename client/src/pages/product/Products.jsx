import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { isAuth } from '../../helpers/auth';

function Products(props) {
    const userId = localStorage.getItem("user") && localStorage.getItem("user").replace(/['"]+/g, '');
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const page = props.location.search.split('=')[1] || 1;

    useEffect(() => {
        axios.get(`/products?page=${page}`)
            .then(res => {
                setLoading(false);
                setProducts(res.data.product);
                setPagination(res.data.pagination);
            })
            .catch(err => toast.dark(err.response.data.err));
    }, []);

    const addToCart = product => {
        const productId = product.target.previousSibling.textContent;
        axios.post(`/users/cart/${userId}`, {productId})
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(err => err.response && toast.dark(err.response.data.message))
    }

    const {currentPage, nextPage, hasNextPage, previousPage, hasPreviousPage, lastPage} = pagination;

    return (
        <div className='background'>
            <ToastContainer/>
            <div className='products'>
                <div className='products-title'>
                    <h1>Products</h1>
                </div>
                <article className='products-flex'>
                    {!loading ?
                        products.length ?
                        products.map(product => {
                            return (
                                <section className='products-flex__single' key={product._id}>
                                    <img src={product.imageUrl} alt={product.title}/><br/>
                                    <div className='products-flex__single--padding'>
                                        <small>
                                            <Link to={`/user/${product.user._id}`}>{userId === product.user._id ? "Your product" : product.user.username}</Link>
                                        </small>
                                        <h2 title={product.title}>{product.title.length < 35 ?  product.title : product.title.substr(0,34) +"..." }</h2>
                                        <p>${product.price}</p>
                                    </div>
                                    <div className='products-flex__buttons'>
                                        <span style={{display: 'none'}}>{product._id}</span>
                                        {isAuth() && userId !== product.user._id && 
                                            <button className='default__btn--small reverse' onClick={addToCart.bind(this)}>
                                                <i className='fa fa-shopping-cart'></i> Add To Cart
                                            </button>
                                        }
                                        <Link className='default__btn--small reverse' to={`/products/${product._id}`}>
                                            Details
                                        </Link>
                                    </div>
                                </section>
                            );
                        })
                            :
                        <h2 className='empty'>There are no products.<br/>Add first product in <Link to='/add-product'>add product</Link> page</h2>
                            :
                        <h1 className='loading'>
                            <i className='fa fa-archive'></i>
                            <br/>Loading your cumbersome products
                        </h1>}
                </article>
                {hasPreviousPage && hasNextPage && <section className='pagination'>
                    {
                        currentPage !== 1 &&
                        previousPage !== 1 &&
                        <Link to='/products?page=1'>1</Link>
                    }
                    {
                        hasPreviousPage &&
                        <Link to={`/products?page=${previousPage}`}>{previousPage}</Link>
                    }
                    <Link to={`/products?page=${currentPage}`} className='active'>{currentPage}</Link>
                    {
                        hasNextPage &&
                        <Link to={`/products?page=${nextPage}`}>{nextPage}</Link>
                    }
                    {
                        lastPage !== currentPage &&
                        nextPage !== lastPage &&
                        <Link to={`/products?page=${lastPage}`}>{lastPage}</Link>
                    }
                </section>}
            </div>
        </div>
    )
}

export default Products
