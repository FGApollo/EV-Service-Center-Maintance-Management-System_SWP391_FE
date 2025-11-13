import { useState, useEffect } from 'react';
import { 
  getAllCustomers,
  createCustomer,
  updateUser,
  deleteEmployee 
} from '../../../api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllCustomers(); // getAllCustomers() returns array directly
      console.log('📦 getAllCustomers data:', data);
      console.log('📦 Is array?', Array.isArray(data));
      
      const customersList = Array.isArray(data) ? data : [];
      console.log('📦 Setting customers:', customersList);
      setCustomers(customersList);
      setLoading(false);
    } catch (err) {
      console.error('❌ fetchCustomers error:', err);
      setError(err.message || 'Failed to fetch customers');
      setLoading(false);
      setCustomers([]);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const response = await createCustomer(customerData);
      await fetchCustomers(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const editCustomer = async (id, customerData) => {
    try {
      const response = await updateUser(id, customerData);
      await fetchCustomers(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeCustomer = async (id) => {
    try {
      await deleteEmployee(id);
      await fetchCustomers(); // Refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer
  };
};
