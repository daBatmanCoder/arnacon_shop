import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [dataer, setData] = useState({});

    // Method to update the context data
    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <DataContext.Provider value={{ dataer, updateData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
