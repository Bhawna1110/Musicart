import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './MyInvoice.module.css';

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userFullName, setUserFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderTotalwithConFee, setOrderTotalwithConFee] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');


  const checkLoggedIn = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/cart');
  };

  const handleLogin = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/register');
  };





  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/orders');
        

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data)
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, []);


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
      const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/user-data', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUserFullName(userData.username);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };


  return (
    <div className={styles.invoicesPage}>
      <div className={styles.carthead}>
        <div className={styles.mobNumber}>
          <span><img className={styles.phone} src="phone.png" alt="Phone Icon" /></span>
          <span className={styles.phoneNumber}>912121131313</span>
          <span className={styles.discountOffer}>Get 50% off on selected items | Shop Now</span>
        </div>
        <div className={styles.userOptions}>
          {isLoggedIn ? (
            <span onClick={handleLogout}>Logout</span>
          ) : (
            <>
              <span onClick={handleLogin}>Login</span>
              <span> | </span>
              <span onClick={handleSignup}>Signup</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.emptyCart}></div>
      <div className={styles.logoCart}>
        <img className={styles.cartImage} src="logo.png" alt="Logo" />
        <div className={styles.cartLogo}>Musicart</div>
        <p className={styles.cartOption}>
          Home/View Cart
        </p>
      </div>

      <div>
        <button className={styles.backToProducts} onClick={() => navigate('/cart')}> Back to Cart</button>
        <h1 className={styles.checkoutTitle}>My Invoices</h1>
      </div>

      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order ID: {order._id} - Total: ₹{order.orderTotal}
            <Link to={`/orders/₹{order._id}`}>View Invoice</Link>
          </li>
        ))}
      </ul>
      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer>
    </div>
  );
};

export default InvoicesPage;
