import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import log from './assets/img/login.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://bike-service-management-2.onrender.com/login', { email, password })
      .then(result => {
        console.log("Server Response:", result.data);
        if (result.data === "Login successful") {
          console.log("Login successful");
          localStorage.setItem('loggedInUserEmail', email); 
          navigate('/service');
        } else if (result.data === "Login Admin") {
          console.log("Login as admin successful");
          localStorage.setItem('isAdmin', 'true');
          navigate('/admin');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error during login:', err);
        setError('Check your credentials.');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-content"> 
      <img src={log} alt="Bike Service Login" className="log_img" />
      <div className="content">
        <div className="text">Welcome Back! 🚴‍♂️</div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <input 
              placeholder='Enter your email' 
              type="email" 
              name="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <span>📧</span>
          </div>
          <div className="field" style={{ position: 'relative' }}>
            <input 
              placeholder='Enter your password' 
              type={showPassword ? "text" : "password"} 
              name="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span>🔒</span>
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer'
              }}
            >{showPassword ? '🙈' : '👁️'}</button>
          </div>
          <button type="submit" className="primaryBtn">🔐 Sign In</button>
          <div className="sign-up">
            <p>Don't have an account? <Link to="/register">Create Account</Link></p>
            <p>Back to <Link to="/">Home</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;