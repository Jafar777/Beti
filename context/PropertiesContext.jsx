// context/PropertiesContext.jsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, loading, error }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within PropertiesProvider');
  }
  return context;
}