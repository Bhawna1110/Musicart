import React from 'react';
import styles from './order.module.css'; // Import CSS module

function Order() {
  return (
    <div>
      <div className={styles.logocart}>
        <img className={styles.cartimg} src="logo.png" alt="Logo" />
        <div className={styles.cartlogo}>Musicart</div>
      </div>
      <div className={styles.orderContainer}>
        <div className={styles.order}>
        <img src="confetti.png" alt="Image" className={styles.imageAboveText} />
          
          <h1 className={styles.ordertext}>Order is placed successfully!</h1>
          <p className={styles.ordermess}>You will be receiving a confirmation email with order details</p>
          
           <button className={styles.orderbtn}> Go back to Home page</button>
         
         
        </div>

      </div>
      <footer className={styles.last}>
            © Musicart | All rights reserved
          </footer>
    </div>
  );
}

export default Order;
