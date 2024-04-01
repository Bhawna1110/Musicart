import React, { useState, useEffect } from 'react';
import styles from './CartPage.module.css'; // Import CSS module

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/cart', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  return (
    <div className={styles.cartpage}>
      <div className={styles.carthead}>
        <div className={styles.cartnumber}>
          <span><img className={styles.cartphone} src="phone.png" alt="Phone Icon" /></span>
          <span className={styles.cartnumber}>912121131313</span>
          <p className={styles.cartoffer}>Get 50% off on selected items | Shop Now</p>
        </div>
        <div className={styles['log-options']}>
          <span >Logout</span>
          <>
            <span>Login</span>
            <span> | </span>
            <span >Signup</span>
          </>
        </div>
      </div>
      <div className={styles.emptycart}></div>
      <div className={styles.logocart}>
        <img className={styles.cartimg} src="logo.png" alt="Logo" />
        <div className={styles.cartlogo}>Musicart</div>
        <div className={styles.cartoption}>
          <span>Home/View Cart</span>
        </div>
        <button className={styles.backtoproducts}> Back to products</button>
        <button className={styles.cartcartbutton}>
          <img className={styles.picture} src="viewcart.png" alt="Cart Icon" />
          View Cart 
        </button>
        <div className={styles.cartheading}>
          <p className={styles.bag}><img src='bag.png' alt="Bag icon" />My Cart</p>
        </div>
      </div>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <p>Product Name: {item.name}</p>
            <p>Price: {item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Color: {item.color}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
