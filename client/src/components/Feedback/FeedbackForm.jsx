import React, { useMemo, useState } from "react";
import axios from "axios";
import "../../styles/feedback.css";

const initialForm = {
  customerName: "",
  email: "",
  phone: "",
  category: "",
  subject: "",
  message: ""
};

const FeedbackForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const validation = useMemo(() => {
    const errors = {};
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      errors.customerName = "Name must be at least 2 characters.";
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email.";
    }
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      if (/[^0-9]/.test(formData.phone.trim())) {
        errors.phone = "Phone number must contain only numbers (0-9).";
      } else {
        errors.phone = "Enter a 10-digit phone number.";
      }
    }
    if (!formData.category) {
      errors.category = "Please select a category.";
    }
    if (!rating) {
      errors.rating = "Please select a rating.";
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }
    return errors;
  }, [formData, rating]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      await axios.post("http://localhost:5000/api/feedback", { ...formData, rating });
      setSubmitted(true);
      setFormData(initialForm);
      setRating(0);
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const validationMessage = Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors[0].msg
        : "";
      setServerError(validationMessage || error.response?.data?.message || "Could not submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="feedback-card feedback-success">
          <h2>Thank you for your feedback!</h2>
          <p>Your response has been submitted successfully.</p>
          <button type="button" className="btn-primary" onClick={() => setSubmitted(false)}>
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <div className="feedback-header">
          <h1>Customer Feedback</h1>
          <p>Help us improve your UniMeals experience.</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="grid-two">
            <div className="field">
              <label htmlFor="customerName">Full Name</label>
              <input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} />
              {validation.customerName && <small className="error-text">{validation.customerName}</small>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" value={formData.email} onChange={handleChange} />
              {validation.email && <small className="error-text">{validation.email}</small>}
            </div>
          </div>

          <div className="grid-two">
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              {validation.phone && <small className="error-text">{validation.phone}</small>}
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="Delivery">Delivery</option>
                <option value="Product Quality">Product Quality</option>
                <option value="Staff Behavior">Staff Behavior</option>
                <option value="Pricing">Pricing</option>
                <option value="Website Issue">Website Issue</option>
                <option value="Other">Other</option>
              </select>
              {validation.category && <small className="error-text">{validation.category}</small>}
            </div>
          </div>

          <div className="field">
            <label>Rating</label>
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  *
                </button>
              ))}
            </div>
            {validation.rating && <small className="error-text">{validation.rating}</small>}
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={formData.subject} onChange={handleChange} />
            {validation.subject && <small className="error-text">{validation.subject}</small>}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
            {validation.message && <small className="error-text">{validation.message}</small>}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;