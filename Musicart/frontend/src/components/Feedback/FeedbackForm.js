import React, { useState } from 'react';
import styles from './FeedbackForm.module.css';

const FeedbackForm = ({ onClose }) => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Feedback submitted:', { feedbackType, feedbackText });
    onClose(); 
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
   
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="feedbackType">Type of Feedback:</label>
            <select id="feedbackType" value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
              <option value="">Select</option>
              <option value="bugs">Bugs</option>
              <option value="feedback">Feedback</option>
              <option value="query">Query</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="feedbackText">Feedback:</label>
            <textarea id="feedbackText" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
