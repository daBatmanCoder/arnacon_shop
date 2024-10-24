import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import './ipfs_page_design.css'; // Import the CSS file
import { useData } from './DataContext';
import { Switch } from 'antd'; // Assuming you are using Ant Design as your UI library

let keyOfSelectedItem;
let selectedItemGlobal;
let timestampForEmail;
let globalData;

const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // let { isClient, userAddress } = location.state; // Access the state passed via navigate
  const [searchParams] = useSearchParams();
  let uuidEmail = searchParams.get('uuid_email');
  const { dataer, updateData } = useData();


  // Attempt to retrieve userAddress from URL search parameters
  let userAddressFromParams = searchParams.get('user_address');

  // Retrieve userAddress from navigation state
  const { userAddress: userAddressFromState } = location.state || {};

  // Choose userAddress from state primarily, if not available then from URL params
  const userAddress = userAddressFromState || userAddressFromParams;


  const [data, setData] = useState({});
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProdEnv, setProdEnv] = useState(true); // New state for toggling environments

  let urlToMoveToEMAIL;

  useEffect(() => {

    let ipfsUrl;
    console.log("User Address is: " + userAddress);
    
    const angularEMAILURL = "https://angular-docker-o4h4ohxpva-uc.a.run.app";
    
    console.log("UUID EMAIL: " + uuidEmail);

    const handleDataReceive = (event) => {
        console.log("handleDataReceive HERE");
        const signedUUID = event.detail;
        console.log("Signed UUID: " + signedUUID);

        if(uuidEmail){
          console.log("UUID Email: " + uuidEmail);
          keyOfSelectedItem = 1;
          selectedItemGlobal = globalData[1];
          sendToCloudForEMAIL(signedUUID, uuidEmail); // Compressed signed
        } else {
          console.log("Timestamp is: " + timestampForEmail);
          urlToMoveToEMAIL = angularEMAILURL + '?timestamp=' + timestampForEmail + '&signature=' + signedUUID;
          console.log(urlToMoveToEMAIL);
          window.location.href = urlToMoveToEMAIL;
        }
    };
    
    document.addEventListener('onDataReceived', handleDataReceive);

    ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmXbiJTx8EzeTWbg6MLMme8BzaydQ9qH6aHddnLCHYPfA2";

    // 1 item-landline
    
    // ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmZbRQixSqkvuwKmRkvd8kc8z6xmU6BXG4PHxXekAoioUY"
    if(uuidEmail){
      console.log("In 1 email aread");
      ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmamLnyRfuEvH7fxzT9tMXuzr7gbEvDTYTmoFsFh5aQWQK"
    }

    fetch(ipfsUrl)
      .then(response => response.text())
      .then(text => {
        try {
          // eslint-disable-next-line no-eval
          const dictData = eval('(' + text + ')');
          setData(dictData);
          globalData = dictData;
          Object.entries(dictData).forEach(([key, value]) => {
          });
        } catch (error) {
          console.error('Error processing data:', error);
        }
        setIsLoading(false);
        if(uuidEmail){
          console.log("Request sign from native for UUID: " + uuidEmail)
          requestSign(uuidEmail);
        }
      })
      .catch(error => {
        console.error('Error fetching IPFS content:', error);
        setIsLoading(false);
      });
      return () => {
        document.removeEventListener('onDataReceived', handleDataReceive);

      };

  }, [location, updateData]);


  const handlePhotoClick = (key) => {
      setSelectedItemKey(key);
  };

  const handleEnvToggle = () => {
    setProdEnv(!isProdEnv); // Toggle between test and production
  };


  const sendToCloudForEMAIL = (signedUUID, uuidEmail) => {

    const selectedItem = selectedItemGlobal;

    if (keyOfSelectedItem && selectedItem) {
      navigate('/payment', { state: { selectedItem, itemId: keyOfSelectedItem, userAddress: "nope",isProdEnv, uuidEmail, signedUUID} });
    }
  }

  const handleButtonClick = () => {

    const url = 'https://standard-telnyx-app.vercel.app/?user_address=' + userAddress;

    const telegramURL = "https://telegram-auth-two.vercel.app/?user_address=" + userAddress;


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
          if(selectedItem.name === "EMAIL"){
            timestampForEmail = Date.now();
            console.log("Timestamp when defining is: " + timestampForEmail);
            requestSign(timestampForEmail);
          } else{
            if(selectedItem.name === "Coupon"){
              console.log(selectedItem.attributes.url);
              const urls = 'https://coupon-app-beryl.vercel.app' + '?user_address=' + userAddress;
              window.location.href = urls;
            } else{
              if(selectedItem.name === "TELEGRAM"){
                console.log(selectedItem.attributes.url);
                window.location.href = telegramURL;
              } else{
              console.log(isProdEnv);
              navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, userAddress, isProd: isProdEnv} });
              }
            }
          }
        }
      }
    }
  };

  const requestSign = (dataToSign) => {
    const request = {
      action: "sign-data-temp",
      body: {dataToSign}
    };

    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
      window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(request))
    } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
      window.AndroidBridge.processAction(JSON.stringify(request));
    } else {
      console.log("Native interface not available");
    }
    
  };



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
      <Switch checked={isProdEnv} onChange={handleEnvToggle} checkedChildren="Prod" unCheckedChildren="Test" />

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



