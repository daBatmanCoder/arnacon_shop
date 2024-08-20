import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import './ipfs_page_design.css'; // Import the CSS file
import { useData } from './DataContext';

let keyOfSelectedItem;
let selectedItemGlobal;
let timestampForEmail;

const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // let { isClient, userAddress } = location.state; // Access the state passed via navigate
  const [searchParams] = useSearchParams();
  let userAddress = searchParams.get('user_address');  // If your URL is "/some-path?user_address=some_value"
  let uuidEmail = searchParams.get('uuid_email');
  const { dataer, updateData } = useData();

  const [data, setData] = useState({});
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let urlToMoveToEMAIL;

  useEffect(() => {

    let ipfsUrl;
    console.log("User Address is: " + userAddress);
    
    const angularEMAILURL = "https://angular-docker-o4h4ohxpva-uc.a.run.app";


    const handleDataReceive = (event) => {
        const signedUUID = event.detail;
        console.log("Signed UUID: " + signedUUID);

        if(uuidEmail){
          console.log("UUID Email: " + uuidEmail);
          sendToCloudForEMAIL(signedUUID, uuidEmail); // Compressed signed
        } else {
          console.log("Timestamp is: " + timestampForEmail);
          urlToMoveToEMAIL = angularEMAILURL + '?timestamp=' + timestampForEmail + '&signature=' + signedUUID;
          console.log(urlToMoveToEMAIL);
          window.location.href = urlToMoveToEMAIL;
        }
    };
    
    document.addEventListener('onDataReceived', handleDataReceive);

    ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmbJqRZJhpd2dLwKRC5b6FkUya9vKuYP1uUK58xRy2yvVT";

    if(uuidEmail){
      ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmamLnyRfuEvH7fxzT9tMXuzr7gbEvDTYTmoFsFh5aQWQK"
      requestSign(uuidEmail);
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
      return () => {
        document.removeEventListener('onDataReceived', handleDataReceive);

      };

  }, [location, updateData]);


  const handlePhotoClick = (key) => {
      setSelectedItemKey(key);
      keyOfSelectedItem = key;
      selectedItemGlobal = data[key];
  };


  const sendToCloudForEMAIL = (signedUUID, uuidEmail) => {
    console.log(keyOfSelectedItem);
    const selectedItem = selectedItemGlobal;
    console.log(selectedItem);

    if (keyOfSelectedItem && selectedItem) {
      navigate('/payment', { state: { selectedItem, itemId: keyOfSelectedItem, userAddress: "nope", uuidEmail, signedUUID} });
    }
  }

  const handleButtonClick = () => {

    if(uuidEmail){
      window.top.controller.receiveData("{\"action\":\"data-retrieved\",\"body\":{\"xsign\":\"pvifeOo4gQrDoxqwt/NlfGFICW4/seHOpcsvVcPX66F5OmL0HhBOxe7gRjazGwKYWee/7SyDYv8LUN6UKHGrrhs=\"}}")
    } 
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
          if(selectedItem.name === "EMAIL"){
            timestampForEmail = Date.now();
            console.log("Timestamp when defining is: " + timestampForEmail);

            requestSign(timestampForEmail);
          } else{
              navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, userAddress} });
          }
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



