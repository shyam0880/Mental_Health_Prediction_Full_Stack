import React, { createContext, useState } from 'react';
import initialData  from '../Data';

// Create the context
export const DataContext = createContext();

// Create the provider component
export const DataProvider = ({ children }) => {
    const [mldata, setMldata] = useState(initialData);

    return (
        <DataContext.Provider value={{ mldata, setMldata }}>
            {children}
        </DataContext.Provider>
    );
};