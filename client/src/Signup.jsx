import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './assets/css/signup.css';
import log from './assets/img/login.png';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email address');
      return;
    }
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit');
      return;
    }

    axios.post('https://bike-service-management-2.onrender.com/register', { name, email, password })
      .then(response => {
        if (response.data.error) {
          setError(response.data.message);
        } else {
          console.log(response);
          navigate('/login');
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      });
  };

  return (
    <div className="login-content"> 
      <img src={log} alt="Bike Service Signup" className="log_img" />
      <div className="content">
        <div className="text">
          Join Us! 🚴‍♂️
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder='Enter your full name' 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <span>👤</span>
          </div>
          <div className="field">
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder='Enter your email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <span>📧</span>
          </div>
          <div className="field">
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder='Create a strong password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span>🔒</span>
          </div>
          <button type="submit">Create Account</button>
          <div className="sign-up">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
            <p>Back to <Link to="/">Home</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
