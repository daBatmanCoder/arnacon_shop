import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';       // Import the HomePage component
import InputPage from './InputPage';
import IPFSPage from './IPFSPage';
import PaymentPage from './PaymentPage'; // Import the PaymentPage component
import CreateShop from './CreateShop';   // Import the CreateShop component
import PaymentSuccessPage from './PaymentSuccessPage';   // Import the PaymentSuccessPage component
import PaymentFailurePage from './PaymentFailurePage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IPFSPage />} />              // New Route for HomePage
        {/* <Route path="/" element={<HomePage />} />              // New Route for HomePage */}
        {/* <Route path="/input" element={<InputPage />} />       // Updated Route for InputPage */}
        <Route path="/shop" element={<IPFSPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/create-shop" element={<CreateShop />} /> // New Route for CreateShop
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
      </Routes>
    </Router>
  );
};

export default App;
