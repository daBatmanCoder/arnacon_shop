import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styleHomePage.css'; // Import your CSS file

const CreateShop = () => {

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const [internalDB, setInternalDB] = useState({});

  const [item, setItem] = useState({
    description: "",
    image: "",
    name: "",
    attributes: [
      { trait_type: "Price", value: "" },
      { trait_type: "Currency", value: "" },
      { display_type: "boost_number", trait_type: "Duration", value: "" }
    ]
  });

  const handleAddItem = () => {
    const newItemKey = Object.keys(internalDB).length + 1;
    setInternalDB({ ...internalDB, [newItemKey]: item });
    setItemAdded(true);
    setShowJson(false);
  };

  const handleChange = (e, index, attribute = null) => {
    if (attribute) {
      const newAttributes = [...item.attributes];
      newAttributes[index][attribute] = e.target.value;
      setItem({ ...item, attributes: newAttributes });
    } else {
      setItem({ ...item, [e.target.name]: e.target.value });
    }
  };
  
  const symbols = {
    None: '',
    USD: '$',
    EUR: '€',
    ILS: '₪',
    GBP: '£',
    // Add more currencies if needed
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      None: '',
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

  const handleCreateJsonClick = () => {
    setShowJson(true);
    isButtonDisabled = true;
  };

  const handleAddAnotherItem = () => {
    setItem({ description: "", image: "", name: "", attributes: item.attributes });
    setItemAdded(false);
  };

  const handleFinishBuild = () => {
    // Logic to handle the completion of the build
    console.log("Final Shop Data:", internalDB);
  };

  const handleBackClick = () => {
    if (Object.keys(internalDB).length > 0) {
      setIsModalOpen(true); // Show confirmation modal
    } else {
      navigate(-1); // Go back if no items
    }
  };

  const handleConfirmDiscard = () => {
    setInternalDB({}); // Clear the internalDB
    setIsModalOpen(false);
    navigate(-1); // Navigate back
  };


  let isButtonDisabled = !item.name || !item.description || !item.image || item.attributes.some(attr => !attr.value);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <button onClick={() => handleBackClick()}>Go Back</button>
    <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDiscard}
      />
      <h2>Create Your Shop Item</h2>
      <label>
        Name:
      <input
        style={{ marginLeft: '5px', marginBottom: '10px', marginRight:'10px' }}
        name="name"
        value={item.name}
        onChange={handleChange}
        placeholder="Name"
      />
      </label>
      <label>
        Description:
      <input
        style={{ marginLeft: '5px', marginBottom: '10px', marginRight:'10px' }}

        name="description"
        value={item.description}
        onChange={handleChange}
        placeholder="Description"
      />
      </label>
      <label>
        Image URL:
      <input
        style={{ marginLeft: '5px', marginBottom: '10px', marginRight:'10px' }}
        name="image"
        value={item.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      
      </label>
      <div style={{ marginBottom: '10px' }}>Attributes:</div>
        {item.attributes.map((attr, index) => (
        <div key={index} style={{ display: 'block', marginBottom: '5px' }}>
            <label style={{ marginRight: '5px' }}>{attr.trait_type}:</label>
            {attr.trait_type === "Currency" ? (
            <select
                value={attr.value}
                onChange={(e) => handleChange(e, index, 'value')}
                style={{ marginLeft: '5px', flex: 1 }}
            >
                {Object.keys(symbols).map((currency) => (
                <option key={currency} value={currency}>{symbols[currency]}</option>
                ))}
            </select>
            ) : (
            <input
                style={{ marginLeft: '5px', flex: 1 }}
                value={attr.value}
                onChange={(e) => handleChange(e, index, 'value')}
                placeholder={`${attr.trait_type} Value`}
            />
            )}
        </div>
        ))}
      <div></div>
      <button onClick={handleCreateJsonClick} disabled={isButtonDisabled}>Preview item</button>

      {showJson && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Preview Your Shop Item</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: '1', maxWidth: '200px', margin: '10px', textAlign: 'center', boxSizing: 'border-box' }}>
              <img src={item.image} alt={item.name} style={{ width: '200px', height: '200px', objectFit: 'cover', marginBottom: '10px' }} />
              <div>{item.name}</div>
              <p>{item.description}</p>
              <div>
                {`${getPriceCurrencyAndDuration(item.attributes).price} ${getPriceCurrencyAndDuration(item.attributes).currencySymbol}`}
              </div>
              <div>{getPriceCurrencyAndDuration(item.attributes).duration}</div>
            </div>
          </div>
          <button onClick={handleAddItem} disabled={itemAdded}>Add Item to Shop</button>
        </div>
      )}

    {itemAdded && (
        <div style = {{ marginTop:'50px',}}>
            <div style = {{color:'green'}}>Successfully added item to current shop build.</div>
            <button onClick={handleAddAnotherItem} style={{ marginLeft: '5px', marginBottom: '10px', marginRight:'10px', marginTop:'30px' }} >Add Another Item</button>
            
            <button onClick={handleFinishBuild} style={{ marginLeft: '5px', marginBottom: '10px', marginRight:'10px' }} >Finish Build</button>
        </div>
        )}
    </div>
  );
};

export default CreateShop;




const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
      <h2>Are you sure you want to discard your changes?</h2>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onClose}>No</button>
    </div>
  );
};