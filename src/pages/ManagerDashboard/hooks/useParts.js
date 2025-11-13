import { useState, useEffect } from 'react';
import * as API from '../../../api';

/**
 * Custom hook for Parts Management
 * Handles fetching, adding, updating, deleting parts
 */
export const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all parts
   */
  const fetchParts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [useParts] Fetching parts from API...');
      const data = await API.getAllParts();
      console.log('✅ [useParts] Parts loaded:', data.length);
      setParts(Array.isArray(data) ? data : []);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('❌ [useParts] Error loading parts:', err);
      setError(err.message || 'Failed to fetch parts');
      setLoading(false);
      setParts([]);
      return [];
    }
  };

  /**
   * Add new part
   * @param {Object} partData - Part data { name, description, unitPrice, minStockLevel }
   */
  const addPart = async (partData) => {
    try {
      console.log('➕ [useParts] Adding new part:', partData);
      const result = await API.createPart(partData);
      console.log('✅ [useParts] Part added successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts] Error adding part:', err);
      return { success: false, error: err.message || 'Failed to add part' };
    }
  };

  /**
   * Update existing part
   * @param {Number} id - Part ID
   * @param {Object} data - Updated data
   */
  const updatePart = async (id, data) => {
    try {
      console.log('📝 [useParts] Updating part:', { id, data });
      const result = await API.updatePart(id, data);
      console.log('✅ [useParts] Part updated successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts] Error updating part:', err);
      return { success: false, error: err.message || 'Failed to update part' };
    }
  };

  /**
   * Delete part
   * @param {Number} id - Part ID
   */
  const deletePart = async (id) => {
    try {
      console.log('🗑️ [useParts] Deleting part:', id);
      await API.deletePart(id);
      console.log('✅ [useParts] Part deleted successfully');
      await fetchParts(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('❌ [useParts] Error deleting part:', err);
      return { success: false, error: err.message || 'Failed to delete part' };
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return {
    parts,
    loading,
    error,
    fetchParts,
    addPart,
    updatePart,
    deletePart
  };
};
