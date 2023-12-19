import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styleHomePage.css'; // Import your CSS file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Shop Application</h1>
      <button className="button-gap" onClick={() => navigate('/input')}>Build Store</button>
      <button onClick={() => navigate('/create-shop')}>Create Shop</button>
    </div>
  );
};

export default HomePage;
