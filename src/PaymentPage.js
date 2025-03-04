import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './input_page_design.css';
import './payment_page.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const { selectedItem, itemId, userAddress, isProd, uuidEmail, signedUUID} = location.state || {};

  const handleReturn = () => {
    navigate('/shop', { state: { userAddress } });
  };

  const calledOnce = useRef(false);

  useEffect(() => {
    if (name === "Free"){
      const uuid45 = generateUUID();
      const timestamp2 = getTimestamp()
      const url2 = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/bafkreiapgcfzbdv7eqlxspl3ydzbs2f5t74f3tty6zkjrp2hlw25hvczdq"

      console.log("Free package, no need to send to stripeasdadasd123123");
      const data_to_send = { action: "new-item", body: { item: userAddress, url:url2, uuid: uuid45, packageType: "ANONYMOUS", timestamp: timestamp2 } }

      communicateWithNative(data_to_send);
    } else{
      if (!calledOnce.current) {  
        sendToStripeWhatToBuy();
        calledOnce.current = true;
      }
    }
  }, []);

  if (!selectedItem) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <p>No item selected. Please return to the marketplace and select an item.</p>
          <button onClick={() => navigate('/')} className="payment-button back-button">
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const communicateWithNative = (dataToSend) => {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
      window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(dataToSend));
    } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
      window.AndroidBridge.processAction(JSON.stringify(dataToSend));
    } else {
      console.log("Native interface not available");
    }
  };

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getTimestamp() {
    const date = new Date();
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const microseconds = String(date.getMilliseconds() * 1000).padStart(6, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}`;
  }

  const sendToStripeWhatToBuy = async () => {
    setProcessing(true);

    console.log("sent");
    console.log("item ID is: " + itemId);
    console.log("name of package: " + name);
    console.log("Transaction price of : " + transaction_price);
    console.log("Subscription price of : " + subscription_price);
    console.log("user_Address is: " + userAddress);
    console.log("currency is: " + currency);
    console.log("Success URL is: " + success_url);
    console.log("Is it production: " + isProd);

    let body_to_send_server = {
      packageId: itemId,       
      packageName: name,       
      transactionPrice: transaction_price,          
      subscriptionPrice: subscription_price,
      user_address: userAddress,
      currency: currency,
      success_url: success_url,
      failure_url:"https://main-failure-page-309305771885.europe-west4.run.app/",
      isProd:isProd
    }

    if (userAddress === "nope"){
      console.log(" uuid email code:" + uuidEmail);
      console.log(" signed uuid code:" + signedUUID);
      body_to_send_server["uuidEmail"] = uuidEmail;
      body_to_send_server["signedUUID"] = signedUUID;
    }

    try {
      const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/send_stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_to_send_server),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log("Response from Stripe:", data);

      const checkoutUrl = data['url'];
      console.log("Checkout URL:", checkoutUrl);
      setCheckoutUrl(checkoutUrl);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const open_stripe = () => {
    if (name === "Free"){
      setCheckoutUrl("https://www.youtube.com/watch?v=xvFZjo5PgG0");
    } else {
      window.location.href = checkoutUrl;
    }
  };

  const open_ton = async () => {
    console.log("openTON");
    
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("uuid is: " + uuid);

    let typeOfProduct = getProductType(name);

    const jsonForURL = {
      "package_type": typeOfProduct,
      "customer_id": uuid,
      "password": "",
      "packageId": itemId,
      "packageName": name,
      "transactionPrice": transaction_price,
      "subscriptionPrice": subscription_price,
      "user_address": userAddress,
      "uuid_to_sign": uuid,
      "currency": currency,
      "success_url": success_url,
      "failure_url": "https://main-failure-page-309305771885.europe-west4.run.app/",
      "isTon": true
    }

    await sendJsonToServer(jsonForURL);
    
    const url = "ton://transfer/0QDygElEywPigDU_GIBNMYgQinv6bQZfzFRcbrX0xKx-cLqU?amount=" + 100000000 + "&text=" + uuid + "&callback=arnacon://verify"
    requestTONSig(url);
  };

  const getProductType = (productName) => {
    switch (productName) {
      case 'GSM1':
      case 'GSM2':
      case 'GSM3':
          return 'normal_gsm';
          
      case 'WorldWide':
          return 'Telnyx_Package';
      
      case 'CellENS':
      case 'CellENS2':
      case 'EMAIL':
      case 'ENS':
      case 'TELEGRAM':
          return 'web2_ens';
          
      case 'NewSP':
      case 'Coupon':
      case 'Redirect':
      case 'Free':
          return 'AirAlo_eSim';
      
      default:
          return 'Unknown Package';
    }
  };

  const sendJsonToServer = async (jsonForURL) => {
    console.log("Sending json to server");

    try {
      const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/new_order_dispatcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonForURL),
      });
      console.log("Response from server:", response);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const requestTONSig = (urlToSend) => {
    const request = {
      action: "open-deeplink",
      body: {url: urlToSend}
    };

    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
      window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(request))
    } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
      window.AndroidBridge.processAction(JSON.stringify(request));
    } else {
      console.log("Native interface not available");
    }
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      ILS: '₪',
      GBP: '£',
    };

    return symbols[currency] || currency;
  };

  const getPriceCurrencyAndDuration = (attributes) => {
    let transaction_price = '';
    let subscription_price = '';
    let currencySymbol = '';
    let duration = '';
    let success_url = '';
  
    attributes.forEach(attr => {
      if (attr.trait_type === 'Price') {
        subscription_price = attr.value;
      } else if (attr.trait_type === 'Currency') {
        currencySymbol = getCurrencySymbol(attr.value);
        currency = attr.value;
      } else if (attr.trait_type === 'Duration') {
        duration = attr.value + ' days';
      } else if (attr.trait_type === 'InitP') {
        transaction_price = attr.value;
      } else if (attr.trait_type === 'url') {
        success_url = attr.value;
      }
    });
  
    return { subscription_price, transaction_price, currencySymbol, duration, success_url };
  };

  let currency;
  let { image, name, description, attributes } = selectedItem;
  let { subscription_price, transaction_price, currencySymbol, success_url } = getPriceCurrencyAndDuration(attributes);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1 className="payment-title">Complete Your Purchase</h1>
      </div>
      
      <div className="payment-content">
        <div className="payment-image-container">
          <img src={image} alt={name} className="payment-image" />
        </div>
        
        <div className="payment-details">
          <h2 className="payment-product-name">{name}</h2>
          <p className="payment-product-description">{description}</p>
          
          <div className="payment-price">
            <span className="payment-price-label">Price:</span>
            {currencySymbol}{subscription_price}
          </div>
          
          {processing && (
            <div className="processing-indicator">
              <div className="processing-spinner"></div>
              <p>Preparing secure checkout...</p>
            </div>
          )}
          
          <div className="payment-buttons">
            <button 
              disabled={!checkoutUrl} 
              className="payment-button stripe-button" 
              onClick={open_stripe}
            >
              <span className="payment-icon">💳</span>
              Pay with Stripe
            </button>
            
            <button 
              className="payment-button ton-button" 
              onClick={open_ton}
            >
              <span className="payment-icon">⚡</span>
              Pay with TON
            </button>
            
            <button 
              onClick={handleReturn} 
              className="payment-button back-button"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

