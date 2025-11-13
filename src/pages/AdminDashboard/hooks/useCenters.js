import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all centers
  const fetchCenters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with real API when available
      // const data = await API.getAllCenters();
      // Mock data for now
      const data = [
        { id: 1, name: 'EV Center 1', address: 'Hà Nội', manager: 'Nguyễn Văn A', phone: '0912345678', status: 'ACTIVE' },
        { id: 2, name: 'EV Center 2', address: 'TP HCM', manager: 'Trần Thị B', phone: '0987654321', status: 'INACTIVE' }
      ];
      setCenters(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch centers');
      setLoading(false);
      setCenters([]);
      return [];
    }
  }, []);

  // Add new center
  const addCenter = useCallback(async (centerData) => {
    try {
      setError(null);
      // TODO: Replace with API.createCenter(centerData)
      // Mock: add to state
      setCenters(prev => [...prev, { ...centerData, id: Date.now() }]);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add center');
      return { success: false, error: err.message };
    }
  }, []);

  // Update center
  const updateCenter = useCallback(async (centerId, centerData) => {
    try {
      setError(null);
      // TODO: Replace with API.updateCenter(centerId, centerData)
      setCenters(prev => prev.map(c => c.id === centerId ? { ...c, ...centerData } : c));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update center');
      return { success: false, error: err.message };
    }
  }, []);

  // Delete center
  const deleteCenter = useCallback(async (centerId) => {
    try {
      setError(null);
      // TODO: Replace with API.deleteCenter(centerId)
      setCenters(prev => prev.filter(c => c.id !== centerId));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete center');
      return { success: false, error: err.message };
    }
  }, []);

  return {
    centers,
    loading,
    error,
    fetchCenters,
    addCenter,
    updateCenter,
    deleteCenter
  };
};
