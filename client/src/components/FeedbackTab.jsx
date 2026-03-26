import React, { useState } from 'react';
import axios from 'axios';

const FeedbackTab = ({ orderId, userId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback/submit', {
        orderId,
        userId,
        rating,
        comment
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback", err);
      alert("Error submitting feedback");
    }
  };

  if (submitted) return <div className="success-msg">Thank you for your feedback!</div>;

  return (
    <div className="feedback-container" style={{ padding: '20px', border: '1px solid #ddd' }}>
      <h3>Rate your Delivery</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating (1-5): </label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Stars</option>)}
          </select>
        </div>
        <br />
        <div>
          <textarea 
            placeholder="Tell us about the food and delivery..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{ width: '100%' }}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackTab;