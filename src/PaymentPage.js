import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './input_page_design.css'; // Import the CSS file


const PaymentPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);  // State to manage the display of the processing message
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const { selectedItem, itemId, userAddress } = location.state || {};

    // In PaymentPage component
  const handleReturn = () => {
    navigate('/shop', { state: { returnedFromPayment: true, selectedItem } });
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
    console.log("Failure URL is: " + failure_url);


      try {
      
        const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/send_stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          packageId: itemId,       
          packageName: name,       
          transactionPrice: transaction_price,          
          subscriptionPrice: subscription_price,
          user_address: userAddress,
          currency: currency,
          success_url: success_url,
          failure_url:"https://www.youtube.com/watch?v=xvFZjo5PgG0"
        }),
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
      <button onClick={handleReturn} className="buttons"  style={{ marginTop:'30px'}}>Return Back</button>
    </div>
  );
};


export default PaymentPage;

