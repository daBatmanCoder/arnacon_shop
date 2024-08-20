import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext'; // Import the DataProvider
import HomePage from './HomePage';       // Import the HomePage component
import InputPage from './InputPage';
import IPFSPage from './IPFSPage';
import PaymentPage from './PaymentPage'; // Import the PaymentPage component
import CreateShop from './CreateShop';   // Import the CreateShop component
import PaymentSuccessPage from './PaymentSuccessPage';   // Import the PaymentSuccessPage component
import PaymentFailurePage from './PaymentFailurePage'; 

const App = () => {
  return (
    <DataProvider>
    <Router>
      <Routes>
        <Route path="/" element={<IPFSPage />} />              // New Route for HomePage
        {/* <Route path="/" element={<HomePage />} />              // New Route for HomePage */}
        <Route path="/input" element={<InputPage />} />       // Updated Route for InputPage
        <Route path="/shop" element={<IPFSPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/create-shop" element={<CreateShop />} /> // New Route for CreateShop
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
      </Routes>
    </Router>
    </DataProvider>
  );
};

export default App;


class Controller {
  constructor() {}

  receiveData(_data) {
      const data = JSON.parse(_data);
      document.dispatchEvent(new CustomEvent('onDataReceived', { detail: data.body.xsign }));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.top.controller = new Controller();
});

//{"action":"data-retrieved","body":{"xsign":"pvifeOo4gQrDoxqwt/NlfGFICW4/seHOpcsvVcPX66F5OmL0HhBOxe7gRjazGwKYWee/7SyDYv8LUN6UKHGrrhs="}}

 