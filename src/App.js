import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';       // Import the HomePage component
import InputPage from './InputPage';
import IPFSPage from './IPFSPage';
import PaymentPage from './PaymentPage'; // Import the PaymentPage component
import CreateShop from './CreateShop';   // Import the CreateShop component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />              // New Route for HomePage
        <Route path="/input" element={<InputPage />} />       // Updated Route for InputPage
        <Route path="/shop" element={<IPFSPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/create-shop" element={<CreateShop />} /> // New Route for CreateShop
      </Routes>
    </Router>
  );
};

export default App;
