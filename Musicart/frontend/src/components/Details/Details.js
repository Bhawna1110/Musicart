import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Details.module.css';
import { useNavigate } from 'react-router-dom';



const Details = () => {
  const [product, setProduct] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();


  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    fetchCartItemCount();
    checkLoggedIn();
    setSelectedImage(product?.image || '');
    fetchProductData(id);
  }, [id]);
  useEffect(() => {

    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product]);


  const checkLoggedIn = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/dashboard');
  };

  const handleLogin = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/register');
  };
  const fetchProductData = async (id) => {
    try {
      console.log('Fetching product data...');
      const response = await fetch(`https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/product/${id}`);
      // const response = await fetch(`http://localhost:3000/product/${id}`);

      const data = await response.json();
      console.log('Product data:', data);
      setProduct(data);
      setMainImage(data?.mainImage);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };


  const fetchCartItemCount = async () => {
    try {
      const token = localStorage.getItem('token');
       const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/cart/count', {
      // const response = await fetch('http://localhost:3000/cart/count', {

        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart item count');
      }

      const data = await response.json();
      setCartItemCount(data.count);
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const cartItem = { product: productId, quantity: 1 };
      const response = await fetch(`https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com/add-to-cart/${String(productId)}`, {
      // const response = await fetch(`http://localhost:3000/add-to-cart/${String(productId)}`, {

        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      setCartCount(cartCount + 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleBuyNow = async () => {

    navigate('/cart');
  }



  return (
    <div className={styles.detailspage}>
      <div className={styles.carthead}>
        <div className={styles.mobNumber}>
          <span className={styles.phone} ></span>
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
        <div className={styles.cartImage} />
        <div className={styles.cartLogo}>Musicart</div>
        <p className={styles.cartOption}>
          Home/View Cart
        </p>
        <button className={styles.cartButton} onClick={() => navigate('/cart')}>

          View Cart
        </button>
      </div>

      <div>
        <button className={styles.backToProducts} onClick={() => navigate('/dashboard')}> Back To Products</button>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}> &lt;</button>

      </div>




      {product && (

        <div className={styles.productDetails}>
          <h2>{product.about}</h2>

          <div className={styles.pageContainer}>
            <div className={styles.leftSection}>
              <div className={styles.imageGallery}>
                <img className={styles.mainImage} src={selectedImage} alt={product.name} />
                <div />
                <div className={styles.imageIndicators}>
                  {[product.image1, product.image2, product.image3].map((img, index) => (
                    <div
                      key={index}
                      className={`${styles.imageIndicator} ${selectedImage === img ? styles.active : ''}`}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
                <div className={styles.smallImages}>

                  {[product.image1, product.image2, product.image3].map((img, index) => (
                    <img
                      key={index}
                      className={styles.smallImage}
                      src={img}
                      alt={product.name}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.rightSection}>
              <p className={styles.name}>{product.name}</p>
              <p className={styles.ratings}>{product.ratings}</p> <p className={styles.review}>  {product.review}</p>
              <p className={styles.price}>Price: ₹{Number(product.price).toLocaleString()}</p>
              <p className={styles.color}>{product.color} | {product.type}</p>
              <p className={styles.description}>{product.description}</p>
              <p className={styles.avail}><b>Available:</b> {product.available}</p>
              <p className={styles.avail}><b>Brand:</b> {product.brand}</p>
              <button className={styles.addToCartButton} onClick={() => handleAddToCart(product._id)}>Add to Cart</button><br></br>
              <button className={styles.BuyNowButton} onClick={() => handleBuyNow()}>Buy Now</button>
            </div>
          </div>
        </div>
      )}


      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer>
    </div>
  )
}

export default Details;
