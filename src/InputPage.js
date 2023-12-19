import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './input_page_design.css'; // Import the CSS file

const InputPage = () => {
  const [ipfsUrl, setIpfsUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('ipfsUrl', ipfsUrl);
    navigate(`/shop?ipfsUrl=${encodeURIComponent(ipfsUrl)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <div>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
      <h1>Store URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ipfsUrl}
          onChange={(e) => setIpfsUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Load Shop</button>
      </form>
    </div>
  );
};

export default InputPage;
