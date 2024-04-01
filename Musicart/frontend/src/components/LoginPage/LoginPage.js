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

      const response = await fetch(`http://localhost:3000${authEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3001'
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
          navigate('/Dashboard/dashboard');
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
      <div className={styles.logoContainer}> {/* Use styles.logoContainer */}
        <img className={styles.logoImage} src="logo.png" alt="Logo"/> {/* Use styles.logoImage */}
        <h2 className={styles.paratext}>Musicart</h2> {/* Use styles.paratext */}
      </div>
      <div className={styles.newContainer}> {/* Use styles.newContainer */}
        <h1 className={styles.header}>Sign in</h1> {/* Use styles.header */}
        <form>
          <label className={styles.inputLabel1}> {/* Use styles.inputLabel1 */}
            Enter your email or mobile number
          </label><br />
          <input className={styles.place1}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.passwordField}> {/* Use styles.passwordField */}
            <label className={styles.inputLabel2}> {/* Use styles.inputLabel2 */}
              Password
            </label><br />
            <input className={styles.place2} 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className={styles.button} onClick={() => handleAuth('/login')}> {/* Use styles.button */}
            Continue
          </button>
        </form>
        <p className={styles.note}> {/* Use styles.note */}
          By continuing, you agree to Musicart privacy notice and conditions of use.
        </p>
      </div>
      <div className={styles.text}> {/* Use styles.text */}
        <hr className={styles.line1} /> {/* Use styles.line1 */}
        <p>New to Musicart?</p>
        <hr className={styles.line2} /> {/* Use styles.line2 */}
      </div>
      <button className={styles.newUserLink} onClick={handleRegisterRedirect}>Create your Musicart account</button> {/* Use styles.newUserLink */}
      {error && <div className={styles.errorMessage}>{error}</div>} {/* Use styles.errorMessage */}
      <p className={styles.footer}>Musicart | All rights reserved</p> {/* Use styles.footer */}
    </div>
  );
};

export default LoginPage;
