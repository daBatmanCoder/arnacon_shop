import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import './ipfs_page_design.css'; // Import the CSS file



const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  let userAddress = queryParams.get('user_address') || "0x0000000000000000000000000000000000000000";
  let provider = queryParams.get('provider');

  const [data, setData] = useState({});
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //console.log('Error fetching asdasdasdasdasdIPFS content:');
    //const ipfsUrl = localStorage.getItem('ipfsUrl');

    // 7 Items shop
    //const ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmPMG2UuxfWr5ME8GTVAYA6siXifeE14yByqwuyF298k5o?_gl=1*1pir2qy*_ga*MTI2NzcwMjU4Ny4xNzA0ODAwNjc5*_ga_5RMPXG14TE*MTcwNDgwMDY3OS4xLjEuMTcwNDgwMDg2MS4zOC4wLjA";
    // 4 Items shop
    // https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmP8DwZv1actfYthxwcdTSVYvQMF8cxBht275uCafsy2oB
    const ipfsUrl = "https://orange-acceptable-mouse-528.mypinata.cloud/ipfs/QmP8DwZv1actfYthxwcdTSVYvQMF8cxBht275uCafsy2oB";
    fetch(ipfsUrl)
      .then(response => response.text())
      .then(text => {
        try {
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
    if (selectedItemKey && data[selectedItemKey]) {
      const selectedItem = data[selectedItemKey];
      console.log(userAddress);
      console.log(provider);
      navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, 
                                      user_address: userAddress, 
                                      provider : provider} });
                            }
  };
  

  useEffect(() => {
    if (location.state?.returnedFromPayment && location.state?.selectedItem) {
      const returnedItem = location.state.selectedItem;
      
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
      <div style={{ textAlign: 'center' }}>
        <h1>Cellact Store</h1>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleButtonClick}>Buy Package</button>
      </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(data).map(([key, item]) => {
            const { price, currencySymbol, duration } = getPriceCurrencyAndDuration(item.attributes);
            return (
              <div key={key} style={{ flex: '1', maxWidth: '200px', margin: '10px', textAlign: 'center', boxSizing: 'border-box', border: selectedItemKey === key ? '2px solid blue' : 'none' }}>
                <img src={item.image} alt={item.name} style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px', cursor: 'pointer' }} onClick={() => handlePhotoClick(key)} />
                <div>{`${currencySymbol}${price}`}</div> {/* Price and currency symbol */}
                <div>{duration}</div> {/* Duration */}
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
    </div>
  ); // return function
};// function


export default IPFSPage;


