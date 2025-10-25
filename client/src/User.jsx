import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './assets/css/user.css';

const Users = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

  useEffect(() => {
    if (loggedInUserEmail) {
      axios.get(`https://bike-service-management-2.onrender.com/user-bookings/${loggedInUserEmail}`)
        .then(response => {
          setBookings(response.data);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }
  }, [loggedInUserEmail]);

  const handleCancel = (bookingId) => {
    axios.delete(`https://bike-service-management-2.onrender.com/admin/${bookingId}`)
      .then(response => {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      })
      .catch(error => {
        console.error('Error cancelling booking:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    navigate('/login');
  };

  const handleDownloadPDF = async () => {
    try {
      setMessage('');
      setMessageType('');
      
      const response = await axios.get(`https://bike-service-management-2.onrender.com/user-report-pdf/${loggedInUserEmail}`, {
        responseType: 'blob'
      });
      
      // Create blob and download as PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-bookings-${loggedInUserEmail}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMessage('PDF report downloaded successfully!');
      setMessageType('success');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('No completed bookings found. Complete some services first to generate a report.');
        setMessageType('warning');
      } else {
        setMessage('Error generating PDF report. Please try again.');
        setMessageType('error');
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className="fullScreenContainerUser">
      <div className="containerUser">
        <div className="hallUser">🚴‍♂️ Your Bookings</div>
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link to="/login" className="loUser button" onClick={handleLogout}>
            🚪 Logout
          </Link>
          <Link to="/service" className="button">
            ➕ Book New Service
          </Link>
          {loggedInUserEmail && (
            <button
              className="button button--secondary"
              onClick={handleDownloadPDF}
            >
              ⬇️ Download PDF (Completed Only)
            </button>
          )}
        </div>
        
        {/* Message Display */}
        {message && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid',
            backgroundColor: messageType === 'success' ? '#f0f9ff' : 
                           messageType === 'warning' ? '#fef3c7' : '#fee2e2',
            borderColor: messageType === 'success' ? '#0ea5e9' : 
                        messageType === 'warning' ? '#f59e0b' : '#ef4444',
            color: messageType === 'success' ? '#0c4a6e' : 
                   messageType === 'warning' ? '#92400e' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>
              {messageType === 'success' ? '✅' : 
               messageType === 'warning' ? '⚠️' : '❌'}
            </span>
            <span>{message}</span>
          </div>
        )}
        
        <table className="neumorphicUser">
          <thead>
            <tr>
              <th>👤 Name</th>
              <th>📍 Address</th>
              <th>📱 Phone</th>
              <th>🚲 Vehicle</th>
              <th>🔧 Service</th>
              <th>📅 Date</th>
              <th>🕐 Time</th>
              <th>📊 Status</th>
              <th>🚚 Delivery</th>
              <th>📏 KM</th>
              <th>💲 Amount</th>
              <th>⚡ Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <div>No bookings found. Book your first service!</div>
                </td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.name}</td>
                  <td>{booking.address}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>
                    <span className={`status-${(booking.status || "pending").toLowerCase()}`}>
                      {booking.status || "Pending"}
                    </span>
                  </td>
                  <td>{booking.deliveryDate || "Not Assigned"}</td>
                  <td>{booking.kilometers || 0}</td>
                  <td>{booking.amount != null ? `Rs.${Number(booking.amount).toFixed(2)}` : 'Rs.0.00'}</td>
                  <td>
                    {booking.status === "Pending" && (
                      <button className="cancel-button" onClick={() => handleCancel(booking._id)}>
                        ❌ Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
