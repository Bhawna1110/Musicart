import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './CheckoutPage.module.css';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const [userFullName, setUserFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { orderTotal } = useLocation().state;
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


  const calculateOrderTotalwithConFee = () => {
   
    const TotalwithConFee = orderTotal - 45;
    setOrderTotalwithConFee(TotalwithConFee);
  };




  useEffect(() => {
    fetchUserData();
    checkLoggedIn();
    fetchCartItems();
    calculateOrderTotalwithConFee();
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

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/cart', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      console.log(data)
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };


  const handlePlaceOrder = async () => {
    try {
      const orderDetails = {
        userFullName,
        cartItems,
        deliveryAddress,
        paymentMethod: document.querySelector('.payment-method select').value,
        orderTotal,
      };

 
      const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      console.log("body", orderDetails)

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const responseData = await response.json();
      const orderId = responseData.orderId;


    
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
    navigate('/order');
  };

  return  (
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
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}> &lt;</button>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
      </div>

      <div>
        <div className={styles.section1}>
          <h2 className={styles.sectionTitle1}>1. Delivery Address</h2>
          <span className={styles.deliveryAddress}>
            <label htmlFor="username">{userFullName}</label><br></br>
            <input type="text" id="username" placeholder="Enter your address" onChange={(e) => setDeliveryAddress(e.target.value)} />
          </span>
        </div>
        <hr className={styles.summaryDivider} />

        <div className={styles.section2}>
          <h2 className={styles.sectionTitle2}>2. Payment Method</h2>
          <div className="payment-method">
          <select> {/* Add the class here */}
              <option value="payondelivery">Pay on Delivery</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>
        </div>
        <hr className={styles.summaryDivider} />

        <h2 className={styles.sectionTitle3}>3. Review Items and Delivery</h2>
        <div className={styles.section3}>
          <div className={styles.productGrid}>
            {cartItems.map((item, index) => (
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
        <div className={styles.placeOrderSquare}>
          <button className={styles.placeOrderButton} onClick={handlePlaceOrder}>Place Your Order</button>
          <p className={styles.orderAgreement}>
            By placing your order, you agree to Musicart privacy notice and conditions of use
          </p>
        </div>



        <div className={styles.orderSummary}>
          <button className={styles.placeOrderButton} onClick={handlePlaceOrder}>Place Your Order</button><br></br>
          <p className={styles.orderAgreement1}>
            By placing your order, you agree to Musicart privacy notice and conditions of use
          </p>
          <hr className={styles.summaryDivider} />
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryDetails}>
            <p className={styles.itemTotal}>Items:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.totalAmount}>₹{orderTotalwithConFee}</span></p>
            <p className={styles.deliveryCharge}>Delivery:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹45</p>
            <hr className={styles.summaryDivider} />
            <p className={styles.deliveryCharge}>Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹{orderTotal}</p>
          </div>
        </div>
      </div>
      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer>
      {window.innerWidth <= 767 && (
        <div className={styles.floatingButtonMenu}>
          <div className={styles.floatingButton} onClick={() => navigate('/dashboard')}>
            <img src="home.png" alt="Home" />
          </div>
          <div className={styles.floatingButton} onClick={() => navigate('/cart')}>
            <img src="carticon.png" alt="Cart" />
          </div>
          {isLoggedIn ? (
            <div className={styles.floatingButton} onClick={handleLogout}>
              <img src="invoice.png" alt="Logout" />
            </div>
          ) : (
            <div className={styles.floatingButton} onClick={handleLogin}>
              <img src="loginicon.png" alt="Login" />
            </div>
          )}
        </div>
      )}
    </div>

  );
};
export default CheckoutPage;
