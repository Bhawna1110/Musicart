import React, { useState, useEffect } from 'react';
import './Details.module.css';

const Details = () => {
  const [product, setProduct] = useState(); // State to store product data
  const [mainImage, setMainImage] = useState(); // State to store the currently displayed main image

  useEffect(() => {
    // Fetch product data from backend when component mounts
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      console.log('Fetching product data...');
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      console.log('Product data:', data);
      setProduct(data);
      setMainImage(data?.mainImage);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };
  
  // Function to handle thumbnail click
  const handleThumbnailClick = (thumbnail) => {
    setMainImage(thumbnail); // Set the clicked thumbnail as the main image
  };

  return (
    <div className="details-container">
      {product && ( // Conditionally render if product data is available
        <div className="carousel-container">
          <div className="main-carousel">
            <img src={mainImage} alt="Main Product" />
          </div>
          {/* Thumbnail carousel */}
          
        </div>
      )}
      {product && ( // Conditionally render if product data is available
        <div className="product-details">
          {/* Product data goes here */}
          <h2>{product.name}</h2>
          <p>Price: {product.price}</p>
          <p>Description: {product.description}</p>
          {/* Add to cart button */}
          <button>Add to Cart</button>
        </div>
      )}
    </div>
  );
};

export default Details;
