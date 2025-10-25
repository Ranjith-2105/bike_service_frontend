import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Service from './Service';
import Admin from './Admin';
import User from './User'; // Import the User component

function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/admin' element={<Admin/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<Signup/>}></Route>
                <Route path='/service' element={<Service/>}></Route>
                <Route path='/user' element={<User/>}></Route> {/* Route for User.jsx */}
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);

export default Main;
