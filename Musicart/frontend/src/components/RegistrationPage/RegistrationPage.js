import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.css'; 

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegistration = async () => {
    try {
      const { username, mobileNumber, email, password } = formData;
      if (!username || !mobileNumber || !email || !password) {
        alert('All fields are required');
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setError('Invalid email format');
        return;
      }
      const response = await fetch('https://sumanbhawna11-gmail-com-cuvette-final-66kf.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://sumanbhawna11-gmail-com-cuvette-final-evaluation-august1.vercel.app'
        },
        body: JSON.stringify({ username, mobileNumber, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        navigate('/login');
      } else {
        console.error('Registration failed:', data.error || 'Internal server error');
        setError(data.error || 'Internal server error');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Network or server error occurred');
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
  
    if (name === 'mobileNumber') {
      updatedValue = value.replace(/\D/g, '');
      updatedValue = updatedValue.slice(0, 10);
    }
  
    setFormData({ ...formData, [name]: updatedValue });
  };
  return (
    <div>
    <input
  className={`${styles.number} ${formData.mobileNumber.length !== 10 && styles.invalidInput}`}
  type="text"
  id="mobile"
  name="mobileNumber"
  value={formData.mobileNumber}
  onChange={handleChange}
/>
      <div className={styles.upper}> 
        <img className={styles.logoimg} src="logo.png" alt="Logo" /> 
        <h2 className={styles.paragraph}>Musicart</h2> 
      </div>
      <div className={styles.container}> 
        <h1 className={styles.Accheader}>Create Account</h1> 
        <form>
          <label className={styles.inputLabela}> 
            Your name
          </label><br />
          <input className={styles.placea} 
            name="username"
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
          /><br />
          <label className={styles.mobile}> 
            Mobile Number
          </label>
          <input className={styles.number}
            type="text"
            id="mobile"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          /><br />
          <label className={styles.mail} htmlFor="email"> 
            Email ID
          </label>
          <input className={styles.identity}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          /><br />
          <label className={styles.pass}>
            Password
          </label>
          <div className={styles.passwordField}> 
            <input className={styles.word}
              name="password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className={styles.info}> 
            By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.
          </p>
          <button type="button" className={styles.theButton} onClick={handleRegistration}>Continue</button> 
          <p className={styles.notice}> 
            By continuing, you agree to Musicart privacy notices and conditions of use.
          </p>
        </form>
      </div>
      <p className={styles.ask}> 
        Already have an account?{' '}
        <a className={styles.link} onClick={() => navigate('/')}>Sign in</a> 
      </p>
      {error && <div className={styles.errorMessage}>{error}</div>} 
      <p className={styles.footerarea}>Musicart | All rights reserved</p> 
    </div>
  );
};

export default RegistrationPage;
