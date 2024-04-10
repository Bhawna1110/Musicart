import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css'; 


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [orderTotal, setOrderTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    checkLoggedIn();
    calculateTotalAmount()  
  }, [totalAmount]);

  useEffect(() => {
    calculateTotalAmount();
    calculateOrderTotal();
    calculateOrderTotal()
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      // const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-66kf.onrender.com/cart', {
      const response = await fetch('http://localhost:3000/cart', {

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
      calculateTotalAmount();
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
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

  const calculateTotalAmount = () => {
   
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const handlePlaceOrder = () => {
    navigate('/checkoutpage', { state: { orderTotal } }); // need to check on this.
  };


  const calculateOrderTotal = () => {
    
    const convienceCharge = 45;
    
    const total = totalAmount + convienceCharge;
    setOrderTotal(total);
  };

  const handleQuantityChange = async (e, itemId) => {
    try {
      const newQuantity = parseInt(e.target.value);
      const token = localStorage.getItem('token');
      // const response = await fetch(`https://sumanbhawna11-gmail-com-cuvette-final-66kf.onrender.com/update-quantity/${itemId}`, {
      const response = await fetch(`http://localhost:3000/update-quantity/${itemId}`, {

        method: 'PUT',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }), 
      });

      console.log("body", body)
  
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedCartItems = cartItems.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        console.log("item", item)
        return item;
      });
      setCartItems(updatedCartItems);
  

      calculateTotalAmount();
      calculateOrderTotal();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  

  return (
    <div className={styles.cartpage}>
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
        <button className={styles.cartButton}>
          <img className={styles.picture} onClick={() => navigate('/dashboard')} src="viewcart.png" alt="Cart Icon" />
          View Cart
        </button>
        </div>
        
        <div>
        <button className={styles.backToProducts} onClick={() => navigate('/dashboard')}> Back to products</button>
        
        </div>
        
        <div className={styles.bagContainer}>
          <img className={styles.cartImg} src="bag.png" alt="Bag icon" />
          <p className={styles.bag}>My Cart</p>
        </div>
        <div className={styles.separatorHori}></div>
      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div className={styles.cartItem} key={item._id}>
            <div className={styles.productDetails}>
              <img className={styles.productImage} src={item.image} alt={item.name} />
              <div className={styles.details}>
                <p className={styles.productName}>{item.name}</p>
                <p className={styles.productColor}>Color: {item.color}</p>
                <p className={styles.inStock}>In Stock</p>
              </div>
            </div>
            <div className={styles.priceDetails}>
  <p className={styles.priceTitle}>Price</p>
  <p className={styles.priceValue}>₹{Number(item.price).toLocaleString()}</p>

  <div className={styles.quantityContainer}>
    <p className={styles.quantityTitle}>Quantity</p>
    <select className={styles.quantityDropdown} value={item.quantity} onChange={(e) => handleQuantityChange(item._id, e.target.value)}>
      {[...Array(8)].map((_, index) => (
        <option key={index + 1} value={index + 1}>{index + 1}</option>
      ))}
    </select>
  </div>

  <p className={styles.totalTitle}>Total</p>
  <p className={styles.totalAmount}>₹{item.price * item.quantity}</p>
</div>

          </div>
          
        ))}
      </div>
      
      <div className={styles.priceDetailsSection}>
        <h2 className={styles.priceDetailsTitle}>PRICE DETAILS</h2>
        <p className={styles.totalMRP}>Total MRP  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{totalAmount}</p>
        <p className={styles.discount}>Discount on MRP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹0</p>
        
        
        <p className={styles.convenienceFee}>Convenience Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹45</p>
        
        <p className={styles.totalAmount}>Total Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹{totalAmount + 45}</p>
        <div className={styles.separatorHori}></div>
        <button className={styles.placeOrder} onClick={handlePlaceOrder}>
        PLACE ORDER
      </button> 
       
        </div>
        
    
   
      <div className={styles.end}>
 
       <p className={styles.amt} >₹{totalAmount + 45}</p>

      
      </div>
      
      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer> 
    </div>
  );
};

export default CartPage;
