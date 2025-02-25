import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './ipfs_page_design.css';
import { useData } from './DataContext';
import { Switch } from 'antd';

let keyOfSelectedItem;
let selectedItemGlobal;
let timestampForEmail;
let globalData;

const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [isTestEnv, setTestEnv] = useState(true);

  let urlToMoveToEMAIL;

  const [activeCategory, setActiveCategory] = useState('');
  const categoryRefs = useRef({});

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
        sendToCloudForEMAIL(signedUUID, uuidEmail);
      } else {
        console.log("Timestamp is: " + timestampForEmail);
        urlToMoveToEMAIL = angularEMAILURL + '?timestamp=' + timestampForEmail + '&signature=' + signedUUID;
        console.log(urlToMoveToEMAIL);
        window.location.href = urlToMoveToEMAIL;
      }
    };
    
    document.addEventListener('onDataReceived', handleDataReceive);

    ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/bafkreiab4a2mnxwyn6e4zh6ttidhbx6tcazrbzyhbmekztgf3yuq4bv2vu";
    
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
    setTestEnv(!isTestEnv);
  };

  const sendToCloudForEMAIL = (signedUUID, uuidEmail) => {
    const selectedItem = selectedItemGlobal;

    if (keyOfSelectedItem && selectedItem) {
      navigate('/payment', { state: { selectedItem, itemId: keyOfSelectedItem, userAddress: "nope", isTestEnv, uuidEmail, signedUUID} });
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
      } else if(selectedItem.name === "Redirect"){
        console.log(selectedItem.attributes.url);
        const urls = 'https://redirect-back.vercel.app/'
        window.location.href = urls;
      } else if(selectedItem.name === "EMAIL"){
        timestampForEmail = Date.now();
        console.log("Timestamp when defining is: " + timestampForEmail);
        requestSign(timestampForEmail);
      } else if(selectedItem.name === "Coupon"){
        console.log(selectedItem.attributes.url);
        const urls = 'https://coupon-app-beryl.vercel.app' + '?user_address=' + userAddress;
        window.location.href = urls;
      } else if(selectedItem.name === "TELEGRAM"){
        console.log(selectedItem.attributes.url);
        window.location.href = telegramURL;
      } else if(selectedItem.name === "TNS"){
        console.log(selectedItem.attributes.url);
        const urlForTON = "https://ton-verif.vercel.app/?user_address=" + userAddress;
        window.location.href = urlForTON;
      } else if(selectedItem.name === "MNP"){
        console.log(selectedItem.attributes.url);
        const urlForMNP = "https://asterisk-tts-test.web.app/?walletAddress=" + userAddress;
        window.location.href = urlForMNP;
      } else {
        console.log(isTestEnv);
        navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, userAddress, isProd: !isTestEnv} });
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
        duration = attr.value + ' days';
      }
    });
  
    return { price, currencySymbol, duration };
  };

  // Add this useEffect for intersection observer to highlight active category
  useEffect(() => {
    if (isLoading || Object.keys(data).length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px', // Consider section in view when in the top 20% of viewport
      threshold: 0
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id.replace('section-', ''));
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all category sections
    Object.keys(categoryRefs.current).forEach(category => {
      if (categoryRefs.current[category]) {
        observer.observe(categoryRefs.current[category]);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, [isLoading, data]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading digital marketplace...</div>
      </div>
    );
  }

  // Group items by category (using name as a basic category indicator)
  const groupedItems = Object.entries(data).reduce((acc, [key, item]) => {
    // Simple categorization based on name prefix or specific keywords
    let category = 'Other';
    
    if (item.name.includes('GSM')) {
      category = 'GSM Plans';
    } else if (['WorldWide', 'CellENS', 'CellENS2'].includes(item.name)) {
      category = 'Connectivity';
    } else if (['EMAIL', 'TELEGRAM', 'TNS'].includes(item.name)) {
      category = 'Communication';
    }
    
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, item });
    return acc;
  }, {});

  // Create array of categories for navigation
  const categories = Object.keys(groupedItems);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">Cellact Marketplace</h1>
        <p className="shop-subtitle">Your gateway to digital connectivity solutions powered by blockchain technology</p>
        
        <div className="env-toggle">
          <Switch 
            checked={isTestEnv} 
            onChange={handleEnvToggle} 
            checkedChildren="Test" 
            unCheckedChildren="Prod" 
            className="environment-switch"
          />
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="category-nav">
        <div className="category-links">
          {categories.map((category) => (
            <a 
              key={category}
              href={`#section-${category}`}
              className={`category-link ${activeCategory === category ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {category}
            </a>
          ))}
        </div>
      </nav>

      {/* Product Categories */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div 
          key={category} 
          id={`section-${category}`} 
          className="category-section"
          ref={el => categoryRefs.current[category] = el}
        >
          <h2 className="category-title">{category}</h2>
          <div className="products-grid">
            {items.map(({ key, item }) => {
              const { price, currencySymbol, duration } = getPriceCurrencyAndDuration(item.attributes);
              return (
                <div 
                  key={key} 
                  className={`product-card ${selectedItemKey === key ? 'selected' : ''}`}
                  onClick={() => handlePhotoClick(key)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="product-image" 
                  />
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <p className="product-description">{item.description}</p>
                    <div className="product-meta">
                      <div className="product-price">{`${currencySymbol}${price}`}</div>
                      <div className="product-duration">{duration}</div>
                    </div>
                    {selectedItemKey === key && (
                      <button 
                        className="buttons" 
                        onClick={() => handleButtonClick(key)}
                      >
                        Purchase Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IPFSPage;



