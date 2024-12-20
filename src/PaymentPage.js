import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './input_page_design.css'; // Import the CSS file


const PaymentPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);  // State to manage the display of the processing message
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const { selectedItem, itemId, userAddress, isProd, uuidEmail, signedUUID} = location.state || {};


    // In PaymentPage component
  const handleReturn = () => {
    navigate('/shop', { state: { userAddress } });
  };

  const calledOnce = useRef(false);

  useEffect(() => {
    if (name === "Free"){
      console.log("Free package, no need to send to stripeasdadasd");
      const data_to_send = { action: "ITEM", body: { item: "ANONYMOUS", sp : "ANONYMOUS" } }
      communicateWithNative(data_to_send);
    } else{
      if (!calledOnce.current) {  
        sendToStripeWhatToBuy();
        calledOnce.current = true;
      }
    }
    
  }, []);

  if (!selectedItem) {
    return <div>No item selected</div>;
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

  const sendToStripeWhatToBuy = async () => {
    setProcessing(true);  // Show processing message

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
        // const response = await fetch('https://europe-west1-arnacon-staging-production.cloudfunctions.net/payment-link-generator', {
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
      // Handle the response data
      console.log("Response from Stripe:", data);
  
  
      // Extract the checkout URL
      const checkoutUrl = data['url'];
      console.log("Checkout URL:", checkoutUrl);
      setCheckoutUrl(checkoutUrl);
  
  
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setProcessing(false);  // Hide processing message
      }

  };

  const open_stripe = () => {
    
    if (name === "Free"){
      setCheckoutUrl("https://www.youtube.com/watch?v=xvFZjo5PgG0");
    } else{
    window.location.href = checkoutUrl;
    }

  };

  const open_ton = async () => {
    
    console.log("openTON");
    
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    console.log("uuid is: " + uuid);

    let typeOfProduct = getProductType(name);

    // typeOfProduct = "TON";

    const jsonForURL = {
      "package_type": typeOfProduct,
      "customer_id":uuid,
      "password":"",
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
    
    const url = "ton://transfer/0QDygElEywPigDU_GIBNMYgQinv6bQZfzFRcbrX0xKx-cLqU?amount=" + 100000000  + "&text="+ uuid + "&callback=arnacon://verify"
    requestTONSig(url);

  };

  const getProductType = (productName) => {
    switch (productName) {
      case 'GSM1':
      case 'GSM2':
      case 'GSM3':
          return 'normal_gsm';  // GSM-related products
          
      case 'WorldWide':
          return 'Telnyx_Package';  // Worldwide product
      
      case 'CellENS':
      case 'CellENS2':
      case 'EMAIL':
      case 'ENS':
      case 'TELEGRAM':
          return 'web2_ens';  // ENS and Telegram-related products
          
      case 'NewSP':
      case 'Coupon':
      case 'Redirect':
      case 'Free':
          return 'AirAlo_eSim';  // Email, NewSP, Coupon, Redirect, Free product
      
      default:
          return 'Unknown Package';  // In case of an undefined product name
  }
  }


  const sendJsonToServer = async (jsonForURL) => {
    console.log("Sending json to server");

    try{
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

  }

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
        duration = attr.value + ' days'; // Append 'days' to the duration value
      } else if (attr.trait_type === 'InitP') {
        transaction_price = attr.value;
      }else if (attr.trait_type === 'url') {
        success_url = attr.value;
      }
    });
  
    return { subscription_price,transaction_price, currencySymbol, duration, success_url };
  };

  let currency;
  let { image, name, description, attributes } = selectedItem;
  let { subscription_price,transaction_price,  currencySymbol, success_url } = getPriceCurrencyAndDuration(attributes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>Chosen Package</h1>
      <img src={image} alt={name} style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }} />
      <div>{name}</div>
      <div>{description}</div>
      <div>Price: {currencySymbol}{subscription_price}</div>
      <p></p>
      <div>
        {processing && <div id='process'>Processing...</div>}
      </div>
      <button disabled={!checkoutUrl} className="buttons"  onClick={open_stripe}>Pay Now in Stripe</button>
      <button className="buttons"  onClick={open_ton}>Pay Now With $TON</button>
      <button onClick={handleReturn} className="buttons"  style={{ marginTop:'30px'}}>Return Back</button>
    </div>
  );
};


export default PaymentPage;

