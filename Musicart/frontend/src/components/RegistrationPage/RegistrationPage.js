import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.css'; // Import CSS module

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
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <div className={styles.upper}> {/* Use styles.upper */}
        <img className={styles.logoimg} src="logo.png" alt="Logo" /> {/* Use styles.logoimg */}
        <h2 className={styles.paragraph}>Musicart</h2> {/* Use styles.paragraph */}
      </div>
      <div className={styles.container}> {/* Use styles.container */}
        <h1 className={styles.Accheader}>Create Account</h1> {/* Use styles.Accheader */}
        <form>
          <label className={styles.inputLabela}> {/* Use styles.inputLabela */}
            Your name
          </label><br />
          <input className={styles.placea} 
            name="username"
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
          /><br />
          <label className={styles.mobile}> {/* Use styles.mobile */}
            Mobile Number
          </label>
          <input className={styles.number}
            type="text"
            id="mobile"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          /><br />
          <label className={styles.mail} htmlFor="email"> {/* Use styles.mail */}
            Email ID
          </label>
          <input className={styles.identity}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          /><br />
          <label className={styles.pass}> {/* Use styles.pass */}
            Password
          </label>
          <div className={styles.passwordField}> {/* Use styles.passwordField */}
            <input className={styles.word}
              name="password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className={styles.info}> {/* Use styles.info */}
            By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.
          </p>
          <button type="button" className={styles.thebutton} onClick={handleRegistration}>Continue</button> {/* Use styles.thebutton */}
          <p className={styles.notice}> {/* Use styles.notice */}
            By continuing, you agree to Musicart privacy notices and conditions of use.
          </p>
        </form>
      </div>
      <p className={styles.ask}> {/* Use styles.ask */}
        Already have an account?{' '}
        <a className={styles.link} onClick={() => navigate('/login')}>Sign in</a> {/* Use styles.link */}
      </p>
      {error && <div className={styles.errorMessage}>{error}</div>} {/* Use styles.errorMessage */}
      <p className={styles.footerarea}>Musicart | All rights reserved</p> {/* Use styles.footerarea */}
    </div>
  );
};

export default RegistrationPage;