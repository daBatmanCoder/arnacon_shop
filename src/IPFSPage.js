import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import './ipfs_page_design.css'; // Import the CSS file



const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // let { isClient, userAddress } = location.state; // Access the state passed via navigate
  const [searchParams] = useSearchParams();
  let userAddress = searchParams.get('user_address');  // If your URL is "/some-path?user_address=some_value"
  let uuidEmail = searchParams.get('uuid_email');

  const [data, setData] = useState({});
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ipfsUrl;
    console.log("User Address is: " + userAddress);
    requestSign(uuidEmail);

    // if(isClient){
    //   ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmchPnmwwMe48Z8ykPCtdpenQ8XTAnSqruDjGUCw4agLPe";
    // } else{
    //   ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmZMURXmxxpd8hSuWQBuSc8MjRJJpFE3UGiAUyrLYWaGdJ";
    // }
    ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmbJqRZJhpd2dLwKRC5b6FkUya9vKuYP1uUK58xRy2yvVT";
    if(uuidEmail){
      ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmamLnyRfuEvH7fxzT9tMXuzr7gbEvDTYTmoFsFh5aQWQK"
    }
    fetch(ipfsUrl)
      .then(response => response.text())
      .then(text => {
        try {
          // eslint-disable-next-line no-eval
          const dictData = eval('(' + text + ')');
          setData(dictData);
          Object.entries(dictData).forEach(([key, value]) => {
          });
        } catch (error) {
          console.error('Error processing data:', error);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching IPFS content:', error);
        setIsLoading(false);
      });
  }, [location]);

  const handlePhotoClick = (key) => {
    setSelectedItemKey(key);
  };

  const handleButtonClick = () => {
    const url = 'https://standard-telnyx-app.vercel.app/?user_address=' + userAddress;
    if (selectedItemKey && data[selectedItemKey]) {
      const selectedItem = data[selectedItemKey];
      if (selectedItem.name === "WorldWide"){
        console.log(selectedItem.attributes.url);
        window.location.href = url;
      } else{
        if(selectedItem.name === "Redirect"){
          console.log(selectedItem.attributes.url);
          const urls = 'https://redirect-back.vercel.app/'
          window.location.href = urls;
        } else{
          if(uuidEmail){
            console.log("UUID Email: " + uuidEmail);
            requestSign(uuidEmail);
            //navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, userAddress, uuidEmail} });
          }
          navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, userAddress} });
        }
      }
    }
  };

  const requestSign = (dataToSign) => {
    const request = {
      action: "sign-data",
      body: {data: dataToSign}
    };

    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
      window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(request))
    } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
      window.AndroidBridge.processAction(JSON.stringify(request));
    } else {
      console.log("Native interface not available");
    }
    
  };

  let sign; 

  window.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
    const data = event.data;
    const action = data.action;
    const body = data.body;

    if (action == 'data-retrieved') {
      sign = body.xsign;
      console.log("Sign: " + sign);
    }

  });
  

  useEffect(() => {
    if (location.state?.returnedFromPayment && location.state?.selectedItem) {
      // const returnedItem = location.state.selectedItem;
      
      // Optionally reset the state in location to avoid repeated triggering
      location.state.returnedFromPayment = false;
    }
  }, [location]);
  
  

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
      let price = '';
      let currencySymbol = '';
      let duration = '';
    
      attributes.forEach(attr => {
        if (attr.trait_type === 'Price') {
          price = attr.value;
        } else if (attr.trait_type === 'Currency') {
          currencySymbol = getCurrencySymbol(attr.value);
        } else if (attr.trait_type === 'Duration') {
          duration = attr.value + ' days'; // Append 'days' to the duration value
        }
      });
    
      return { price, currencySymbol, duration };
    };
    

  if (isLoading) {
    return <div>Loading content from IPFS...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>Cellact Store</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(data).map(([key, item]) => {
          const { price, currencySymbol, duration } = getPriceCurrencyAndDuration(item.attributes);
          return (
            <div key={key} style={{ flex: '1', maxWidth: '200px', margin: '10px', textAlign: 'center', boxSizing: 'border-box', border: selectedItemKey === key ? '2px solid blue' : 'none' }}>
              <img src={item.image} alt={item.name} style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px', cursor: 'pointer' }} onClick={() => handlePhotoClick(key)} />
              <div>{`${currencySymbol}${price}`}</div>
              <div>{duration}</div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              {selectedItemKey === key && (
                <button className="buttons" style={{ margin: 'auto', display: 'block'}} onClick={() => handleButtonClick(key)}>Buy Package</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default IPFSPage;



