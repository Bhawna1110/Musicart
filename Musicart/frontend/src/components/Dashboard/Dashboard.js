import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Details from '../Details/Details';
import order from '../Order/order';
import FeedbackForm from '../Feedback/FeedbackForm';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [viewType, setViewType] = useState('grid');
  const [filters, setFilters] = useState({
    headphoneType: '',
    companyFeatured: '',
    color: '',
    price: '',
    sortBy: '',
  });


  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };
  const [userFullName, setUserFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchUserData();
    fetchCartItemCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDetailsButtonClick = () => {
    navigate('/Details');
  };

  const handleDetailsButton = () => {
    navigate('/order');
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
      const response = await fetch('http://localhost:3000/user-data', {
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

  const applyFilters = (filters) => {
    let filtered = [...products];

    // Apply filters

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    applyFilters({ ...filters, searchQuery: e.target.value });
  };

  const toggleToGridView = () => {
    setViewType('grid');
  };

  const toggleToListView = () => {
    setViewType('list');
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSortByChange = (value) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    applyFilters(newFilters);
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

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const cartItem = { product: productId, quantity: 1 };
      const response = await fetch(`http://localhost:3000/add-to-cart/${String(productId)}`, {
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

  const handleViewCart = () => {
    navigate('/cart');
  };

  const fetchCartItemCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/cart/count', {
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

  const productContainerClass = viewType === 'grid' ? styles.productGridContainer : styles.productsList;

  return (
    <div className={styles.homepage}>
      <div className={styles.head}>
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
      <div className={styles.emptyLine}></div>
      <div className={styles.logoSection}>
        <img className={styles.image} src="logo.png" alt="Logo" />
        <div className={styles.logo}>Musicart</div>
        <div className={styles.options}>
          <span>Home</span>
          <span>Invoice</span>
        </div>
        <button className={styles.viewCartButton} onClick={handleViewCart}>
          <img className={styles.cart} src="viewcart.png" alt="Cart Icon" />
          View Cart {cartItemCount}
        </button>
        {isLoggedIn && (
          <div className={styles.userInitials} onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
            {userFullName.charAt(0)}
            {isDropdownVisible && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownContent}>
                  <div>{userFullName}</div>
                  <div className={styles.logout} onClick={handleLogout}>Logout</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.carousel}>
        <img className={styles.ban} src="banner.png" alt="Banner" />
        <img className={styles.girl} src="girl.png" alt="Girl" />
        <p className={styles.para}>Grab upto 50% off on<br />Selected headphones</p>
      </div>
      <br />
      <div className={styles.searchBar}>
        <img src="search.png" alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by product name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className={styles.viewOptions}>
        <div className={styles.gridView} onClick={toggleToGridView}>
          <img src="grid.png" alt="Grid View" />
        </div>
        <div className={styles.listView} onClick={toggleToListView}>
          <img src="list.png" alt="List View" />
        </div>
        <div className={styles.filters}>
          <select id="select1" onChange={(e) => handleFilterChange('headphoneType', e.target.value)}>
            <option value="">Headphone type</option>
            <option value="">Featured</option>
            <option value="In-Ear headphone">In-ear headphone</option>
            <option value="On-Ear headphone">On-ear headphone</option>
            <option value="Over-Ear headphone">Over-ear headphone</option>
          </select>
          <select id="select2" onChange={(e) => handleFilterChange('companyFeatured', e.target.value)}>
            <option value="">Company</option>
            <option value="">Featured</option>
            <option value="jbl">JBL</option>
            <option value="sony">Sony</option>
            <option value="boat">Boat</option>
          </select>
          <select id="select3" onChange={(e) => handleFilterChange('color', e.target.value)}>
            <option value="">Color</option>
            <option value="">Featured</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="brown">Brown</option>
          </select>
          <select id="select4" onChange={(e) => handleFilterChange('price', e.target.value)}>
            <option value="">Price</option>
            <option value="">Featured</option>
            <option value="0-1000">₹0-₹1,000</option>
            <option value="1000-10000">₹1,000-₹10,000</option>
            <option value="10000-20000">₹10,000-₹20,000</option>
          </select>
          <select id="select5" onChange={(e) => handleSortByChange(e.target.value)}>
            <option value="">Sort by: Featured</option>
            <option value="">Featured</option>
            <option value="priceLowest">Price: Lowest</option>
            <option value="priceHighest">Price: Highest</option>
            <option value="nameAZ">Name: A-Z</option>
            <option value="nameZA">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className={productContainerClass}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product._id} className={viewType === 'grid' ? styles.productItemGrid : styles.productItemList}>
              <div className={styles.upperSection}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.upperSectionInner}>
                  <button className={styles.addToCartButton} onClick={() => handleAddToCart(product._id)}><img src="cart.png" alt="Add to Cart" /></button>
                </div>
              </div>
              <div className={viewType === 'grid' ? styles.lowerSectionGrid : styles.lowerSectionList}>
                <h3>{product.name}</h3>
                <p>Price- ₹{Number(product.price).toLocaleString()}</p>
                <p>{product.color} | {product.type}</p>
                {viewType === 'list' && (
                  <>
                    <p className={styles.additionalPara}>{product.about}</p>
                    <button className={styles.addToCartButton} onClick={() => handleAddToCart(product._id)}></button>
                    <button className={styles.customButton} onClick={() => handleDetailsButtonClick()}>Details</button>
                    <button onClick={() => handleDetailsButton()}>Order</button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noProductsMessage}>No products found matching your filters.</p>
        )}
        {/* Feedback button */}
      <button className={styles.feedbackButton} onClick={toggleFeedbackForm}>
        <image src="feedback.png"></image>
      </button>

      {/* Feedback form modal */}
      {showFeedbackForm && <FeedbackForm onClose={toggleFeedbackForm} />}
      </div>

      <footer className={styles.bottom}>
        <p>Musicart | All rights reserved</p>
      </footer>
    </div>
  );
};

export default Dashboard;
