import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./assets/css/admin.module.css";
import { Link, useNavigate } from "react-router-dom";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("https://bike-service-management-2.onrender.com/admin");
      const sorted = response.data.sort(
        (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
      setBookings(sorted);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://bike-service-management-2.onrender.com/admin/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      await axios.put(`https://bike-service-management-2.onrender.com/admin/${id}`, updatedFields);
      fetchBookings(); // refresh list after update
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    let formattedHours = parseInt(hours, 10);
    const suffix = formattedHours >= 12 ? "PM" : "AM";
    formattedHours = formattedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>
          <span className={styles.headerIcon}>🛠️</span>
          <span>SERVICE MANAGEMENT</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={handleRefresh}>Refresh</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className={styles.gradientDivider}></div>
      <div className={styles.container}>
        <table className={styles.neumorphic}>
          <thead>
            <tr>
              <th>👤 Name</th>
              <th>🚲 Vehicle</th>
              <th>📱 Phone</th>
              <th>📍 Address</th>
              <th>📅 Date</th>
              <th>🕐 Time</th>
              <th>🔧 Service</th>
              <th>📏 KM</th>
              <th>💲 Amount</th>
              <th>📊 Status</th>
              <th>🚚 Delivery</th>
              <th>⚡ Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <div>No bookings found.</div>
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.vehicleNumber}</td>
                  <td>{b.phone}</td>
                  <td>{b.address}</td>
                  <td>{b.date}</td>
                  <td>{formatTime(b.time)}</td>
                  <td>{b.service}</td>

                  {/* Editable Kilometers */}
                  <td>
                    <input
                      type="number"
                      value={b.kilometers || ""}
                      onChange={(e) =>
                        handleUpdate(b._id, { kilometers: e.target.value })
                      }
                      placeholder="Enter KM"
                    />
                  </td>

              {/* Amount (shown when status Accepted/Completed) */}
              <td>
                <input
                  type="number"
                  value={b.amount || ""}
                  onChange={(e) => handleUpdate(b._id, { amount: e.target.value })}
                  placeholder="Amount"
                />
              </td>

              {/* Updated Status Dropdown */}
              <td>
                    <select
                      value={b.status || "Pending"}
                      onChange={(e) =>
                        handleUpdate(b._id, { status: e.target.value })
                      }
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Accepted">✅ Accepted</option>
                      <option value="On-Process">🔄 On-Process</option>
                      <option value="Completed">🎉 Completed</option>
                    </select>
                  </td>

                  {/* Editable Delivery Date */}
                  <td>
                    <input
                      type="date"
                      value={b.deliveryDate || ""}
                      onChange={(e) =>
                        handleUpdate(b._id, { deliveryDate: e.target.value })
                      }
                    />
                  </td>

                  <td>
                    <button onClick={() => handleDelete(b._id)}>
                      🗑️ Delete
                    </button>
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

export default Admin;
