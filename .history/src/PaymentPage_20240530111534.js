import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './input_page_design.css'; // Import the CSS file


const PaymentPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const { selectedItem, itemId, user_address, provider } = location.state || {};

    // In PaymentPage component
  const handleReturn = () => {
    navigate('/shop', { state: { returnedFromPayment: true, selectedItem } });
  };

  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      sendToStripeWhatToBuy();
      calledOnce.current = true;
    }
  }, []);

  if (!selectedItem) {
    return <div>No item selected</div>;
  }

  const sendToStripeWhatToBuy = async () => {
    console.log("sent");
    console.log("store picked: "+ provider)
    console.log("userAddress is: " + user_address);
    console.log("item ID is: " + itemId);
    console.log("name of package: " + name);
    console.log( "Transaction price of : " + transaction_price);
    console.log( "Subscription price of : " + subscription_price);
    console.log("currency is: " + currency);

    try {
      console.log("sending stripe");
      const response = await fetch('https://us-central1-arnacon-nl.cloudfunctions.net/send_stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: provider,
          userId: user_address,     
          packageId: itemId,       
          packageName: name,       
          transactionPrice: transaction_price,          
          subscriptionPrice: subscription_price,
          currency: currency,
          success_url: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
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
      const checkoutUrls = data['url'];
      console.log("Checkout URL:", checkoutUrl);
      setCheckoutUrl(checkoutUrls);


    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };


  const openUrl = (url) => {
    window.open(url, '_blank'); // '_blank' is used to open the URL in a new tab.
  };

  const open_stripe = () => {
    openUrl(checkoutUrl);
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
      }
    });
  
    return { subscription_price,transaction_price, currencySymbol, duration };
  };

  let currency;
  let { image, name, description, attributes } = selectedItem;
  let { subscription_price,transaction_price,  currencySymbol, duration } = getPriceCurrencyAndDuration(attributes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>Chosen Package</h1>
      <img src={image} alt={name} style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }} />
      <div>{name}</div>
      <div>{description}</div>
      <div>Price: {currencySymbol}{subscription_price}</div>
      <div>Duration: {duration}</div>
      <p></p>

      <button disabled={!checkoutUrl} onClick={open_stripe}>Pay Now in Stripe</button>
      <button onClick={handleReturn} style={{ marginTop:'30px'}}>Return Back</button>
    </div>
  );
};


export default PaymentPage;

