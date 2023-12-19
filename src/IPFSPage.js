import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import Web3 from 'web3';
import './ipfs_page_design.css'; // Import the CSS file


const abi = require('./shop_abi.json');
const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor.publicnode.com"));
let contractAddress = '0x99b022C2961AD2F1313DC04Eb9E3ac74C29b51EB'; // Shop's contract address
let contract = new web3.eth.Contract(abi, contractAddress);

const IPFSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  let userAddress = queryParams.get('userAddress') || "0x0000000000000000000000000000000000000000";

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isTransactionInProgress, setTransactionInProgress] = useState(false);
  const [returnedFromPayment, setReturnedFromPayment] = useState(false);

  const [data, setData] = useState({});
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Error fetching asdasdasdasdasdIPFS content:');
    // const ipfsUrl = localStorage.getItem('ipfsUrl');
    const ipfsUrl = "https://bafybeietdwndenb62h6zn7fmssnfojjzhemenhnbfagbkc3knum7haybvy.ipfs.w3s.link/7-items-store(a).txt";
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

  const mintNFT = async (tokenURI) => {
    try {
      setTransactionInProgress(true); // Transaction starts
      const private_key = "1cf3bacf75f3c8580aabf395ddb3eb5bf2943ce44cc9907a60802a305c3f4e09";
      const public_key = "0xADaAf2160f7E8717FF67131E5AA00BfD73e377d5";
      const nonce = await web3.eth.getTransactionCount(public_key, 'latest'); // get latest nonce
      const checksumAddress = web3.utils.toChecksumAddress(public_key);
      const gasPrice = await web3.eth.getGasPrice();

      // Prepare the transaction details
      const tx = {
        'from': public_key,
        'to': contractAddress,
        'nonce': nonce,
        'gasPrice': gasPrice,
        'gas': 2000000, // Set the gas limit
        'data': contract.methods.safeMint(checksumAddress,tokenURI).encodeABI()
      };

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, private_key);

      // Send the transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log('Transaction receipt:', receipt);
      setTransactionInProgress(false); // Transaction ends
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5 seconds
    }
    catch (e){
      console.log(e);
      setTransactionInProgress(false); // Transaction ends (in case of error)
    }
  };


  const handleButtonClick = () => {
    if (selectedItemKey && data[selectedItemKey]) {
      const selectedItem = data[selectedItemKey];
      console.log(userAddress);
      navigate('/payment', { state: { selectedItem, itemId: selectedItemKey, user_address: userAddress} });
    }
  };
  

  useEffect(() => {
    if (location.state?.returnedFromPayment && location.state?.selectedItem) {
      const returnedItem = location.state.selectedItem;
      
      // buy the NFT here:
      // mintNFT(JSON.stringify(returnedItem));

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
    <div>
        {/* <button onClick={() => navigate('/input')}>Go Back</button> */}
      </div>
      {showSuccessMessage && <div className="success-message">Transaction Successful!</div>}
      <div style={{ textAlign: 'center' }}>
        <h1>Cellact Store</h1>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleButtonClick} disabled={isTransactionInProgress}>
          {isTransactionInProgress ? 'Buying...' : 'Buy Package'}
        </button>
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


