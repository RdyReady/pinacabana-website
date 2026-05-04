'use client';
import { useState } from 'react';
import './EmailCapture.css';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send to an API endpoint
      console.log('Email submitted:', email);
      setSubmitted(true);
      setEmail('');
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        Thank you! You're on the guest list. 🍍
      </div>
    );
  }

  return (
    <form className="email-capture-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="email-input"
        placeholder="Enter your email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary">
        Join
      </button>
    </form>
  );
}
