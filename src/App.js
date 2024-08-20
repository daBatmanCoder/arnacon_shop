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
        <Route path="/input" element={<InputPage />} />       // Updated Route for InputPage
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


class Controller {

    constructor() {
        this.guiFrame = document.getElementById('guiFrame');
    }

    receiveData(_data) {
      console.log("Received data from GUI: " + _data);
        const data = JSON.parse(_data);
        this.guiFrame.contentWindow.postMessage(data, '*');
    }

    sendMessageToNativeApp(jsonData) {

        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage(JSON.stringify(jsonData));
        } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
            console.log(JSON.stringify(jsonData));
            window.AndroidBridge.processAction(JSON.stringify(jsonData));
        } else {
            console.log("Native interface not available");
        }
    }

    signData(data) {
        this.sendMessageToNativeApp({
            action: 'sign_data',
            body: {data: data}
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.top.controller = new Controller();
});
 