import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './assets/css/hall.css';
import book from './assets/img/book.png';

function Service() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (loggedInUserEmail) {
      setEmail(loggedInUserEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (email !== loggedInUserEmail) {
      setError('The email provided does not match the logged-in user email.');
      return;
    }

    try {
      const response = await axios.post('https://bike-service-management-2.onrender.com/book-service', { name, email, phone, address, vehicleNumber, serviceType, date, time });
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user');
        }, 2000);
      } else {
        setError(response.data.message || 'An unexpected error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="login-content">
      <img src={book} alt="Bike Service Booking" className="log_img" />
      <div className="content">
        <div className="text">Book Your Service 🚴‍♂️</div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">✅ Service Booked Successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input 
              type="text" 
              placeholder='Enter your full name' 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <span>👤</span>
          </div>
          <div className="field">
            <input 
              type="email" 
              placeholder='Your email address' 
              id="email" 
              value={email} 
              readOnly 
            />
            <span>📧</span>
          </div>
          <div className="field">
            <input 
              type="tel" 
              id="phone" 
              placeholder='Enter your phone number' 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
            <span>📱</span>
          </div>
          <div className="field">
            <input 
              type="text" 
              placeholder='Enter your address' 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
            <span>📍</span>
          </div>
          <div className="field">
            <input 
              type="text" 
              placeholder='Enter vehicle number' 
              id="vehicleNumber" 
              value={vehicleNumber} 
              onChange={(e) => setVehicleNumber(e.target.value)} 
            />
            <span>🚲</span>
          </div>
          <div className="field">
            <select 
              id="serviceType" 
              value={serviceType} 
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="" disabled>Select Service Type</option>
              <option value="General Service">🔧 General Service</option>
              <option value="Oil Change">🛢️ Oil Change</option>
              <option value="Water Wash">💧 Water Wash</option>
              <option value="Brake Service">🛑 Brake Service</option>
            </select>
            <span>⚙️</span>
          </div>
          <div className="field">
            <input 
              type="date" 
              id="date" 
              placeholder='Select date' 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
            <span>📅</span>
          </div>
          <div className="field">
            <input 
              type="time" 
              id="time" 
              placeholder='Select time' 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />
            <span>🕐</span>
          </div>
          <button type="submit">Book Service</button>
          <div className="sign-up">
            <p><Link to="/user">View Your Bookings</Link></p>
            <p>Back to <Link to="/">Home</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Service;
