import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './pages/product/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import User from './pages/user/User';
import Activation from './pages/user/Activation';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import Header from './pages/miscellaneous/Header';
import Products from './pages/product/Products';
import AddProduct from './pages/product/AddProduct';
import YourProducts from './pages/product/YourProducts';
import Details from './pages/product/Details';
import Cart from './pages/product/Cart';
import Orders from './pages/product/Orders';
import Checkout from './pages/product/Checkout';
import EditProduct from './pages/product/EditProduct';
import PlaceOrder from './pages/product/PlaceOrder';
import PageNotFound from './pages/miscellaneous/404';

export default function App() {
    return (
        <BrowserRouter>
            <Route component={Header}/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/register' component={Register}/>
                <Route path='/login' component={Login}/>
                <Route path='/users/activate/:token' component={Activation}/>
                <Route path='/forgotpassword' component={ForgotPassword}/>
                <Route path='/resetpassword/:token' component={ResetPassword}/>
                <Route path='/user/:userId' component={User}/>
                <Route path='/products/:id' component={Details}/>
                <Route path='/products' component={Products}/>
                <Route path='/cart' component={Cart}/>
                <Route path='/checkout' component={Checkout}/>
                <Route path='/place-order' component={PlaceOrder}/>
                <Route path='/orders' component={Orders}/>
                <Route path='/add-product' component={AddProduct}/>
                <Route path='/edit/:id' component={EditProduct}/>
                <Route path='/your-products' component={YourProducts}/>
                <Route component={PageNotFound}/>
            </Switch>
        </BrowserRouter>
    )
}
