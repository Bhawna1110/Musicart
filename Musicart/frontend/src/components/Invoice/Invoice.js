import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './Invoice.module.css';


const InvoicePage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [userFullName, setUserFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
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
    const fetchOrderDetails = async () => {
      try {
        console.log(orderId)
        const response = await fetch(`https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        console.log("data", data)
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error.message);
      }
    };


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
    console.log("userfullname", userFullName);
    fetchUserData();
    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }



  return (
    <div className={styles.checkoutPage}>
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
        <h1 className={styles.checkoutTitle}>Invoice</h1>
      </div>

      <div className={styles.section1}>
        <h2 className={styles.sectionTitle1}>1. Delivery Address</h2>
        <span className={styles.deliveryAddress}>
          <label htmlFor="username">{userFullName}</label><br></br>
          <input type="text" id="username" value={order.deliveryAddress} readOnly />
        </span>
      </div>

      <hr className={styles.summaryDivider} />

      <div className={styles.section2}>
        <h2 className={styles.sectionTitle2}>2. Payment Method</h2>
        <div className={styles.paymentMethod}>
          <select disabled>
            <option value={order.paymentMethod}>{order.paymentMethod}</option>
          </select>
        </div>
      </div>
      <hr className={styles.summaryDivider} />
      <div className={styles.section3}>
        <div className={styles.productGrid}>
          {order.items.map((item, index) => (
            <img
              key={index}
              className={styles.productImage}
              src={item.image}
              alt={item.name}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
        {selectedItem && (
          <div className={styles.selectedItemDetails}>
            <p className={styles.productName}>Product Name: {selectedItem.name}</p>
            <p className={styles.productColor}>Color: {selectedItem.color}</p>
            <p className={styles.estimatedDelivery}>Estimated delivery</p>
            <p className={styles.deliveryInfo}>Monday - FREE Standard Delivery</p>
          </div>
        )}
      </div>
      <hr className={styles.summaryDivider} />
      <div className={styles.orderSummary}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <div className={styles.summaryDetails}>
          <p className={styles.itemTotal}>Items: <span className={styles.totalAmt}>${order.orderTotal}</span></p>
          <p className={styles.deliveryCharge}>Delivery: $45</p>
          <hr className={styles.summaryDivider} />
          <p className={styles.orderTotal}>Order Total: <span className={styles.totalRed}>${order.orderTotal + 45}</span></p>
        </div>
      </div>
      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer>
    </div>
  );
};

export default InvoicePage;
