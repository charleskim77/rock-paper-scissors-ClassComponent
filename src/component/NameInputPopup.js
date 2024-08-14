import React, { useState } from 'react';

const NameInputPopup = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <button type="submit">Start Game</button>
        </form>
      </div>
    </div>
  );
};

export default NameInputPopup;