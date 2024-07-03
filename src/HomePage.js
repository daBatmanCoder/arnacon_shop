import React from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';

import './styleHomePage.css'; // Import your CSS file

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userAddress = searchParams.get('user_address');  // If your URL is "/some-path?user_address=some_value"

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Shop Application</h1>
      <h2>Are you a service provider or a client?</h2>
      <button 
        className="button-gap" 
        onClick={() => navigate('/shop', { state: { isClient: false, userAddress } })}
      >
        Service provider
      </button>
      <button 
        className="button-gap" 
        onClick={() => navigate('/shop', { state: { isClient: true, userAddress } })}
      >
        Client
      </button>
      {/* <button onClick={() => navigate('/create-shop')}>Create Shop</button> */}
    </div>
  );
};

export default HomePage;
