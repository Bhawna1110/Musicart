import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Import CSS module
import Dashboard from '../Dashboard/Dashboard';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAuth = async (endpoint) => {
    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }

      const authEndpoint = endpoint || '/login';

      const response = await fetch(`https://sumanbhawna11-gmail-com-cuvette-final-cw4j.onrender.com${authEndpoint}`, {
      

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://sumanbhawna11-gmail-com-cuvette-final-evaluation-august1.vercel.app'


        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', email);
          setLoggedIn(true);
          navigate('/dashboard');
        } else {
          console.error(`${authEndpoint.charAt(1).toUpperCase() + authEndpoint.slice(2)} failed:`, data.error || 'Internal server error');

          if (data.errors) {
            console.error('Validation errors:', data.errors);
            setError('Validation errors occurred');
          } else {
            setError(data.error || 'Internal server error');
          }
        }
      } else {
        setError(data.error || 'Internal server error');
      }
    } catch (error) {
      console.error(`Error during authentication:`, error);
      setError('Network or server error occurred');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className={styles.logoContainer}> 
        <img className={styles.logoImage} src="logo.png" alt="Logo"/>
        <h2 className={styles.paratext}>Musicart</h2>
      </div>
      <div className={styles.newContainer}> 
        <h1 className={styles.header}>Sign in</h1> 
        <form>
          <label className={styles.inputLabel1}> 
            Enter your email or mobile number
          </label><br />
          <input className={styles.place1}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.passwordField}>
            <label className={styles.inputLabel2}> 
              Password
            </label><br />
            <input className={styles.place2} 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className={styles.button} onClick={() => handleAuth('/login')}> 
            Continue
          </button>
        </form>
        <p className={styles.note}> 
          By continuing, you agree to Musicart privacy notice and conditions of use.
        </p>
      </div>
      <div className={styles.text}> 
        <hr className={styles.line1} />
        <p>New to Musicart?</p>
        <hr className={styles.line2} /> 
      </div>
      <button className={styles.newUserLink} onClick={handleRegisterRedirect}>Create your Musicart account</button> 
      {error && <div className={styles.errorMessage}>{error}</div>} 
      <p className={styles.footer}>Musicart | All rights reserved</p>
    </div>
  );
};

export default LoginPage;
