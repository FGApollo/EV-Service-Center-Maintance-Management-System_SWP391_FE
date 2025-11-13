import { useState, useEffect } from 'react';
import * as API from '../../../api';

/**
 * Custom hook for Staff Management
 * Handles fetching, adding, updating, deleting staff
 * @returns {Object} Staff data and CRUD functions
 */
export const useStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all staff (TECHNICIAN + STAFF roles)
   * Filtered by current center (frontend filtering since backend doesn't have API yet)
   */
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useStaff] Fetching staff from API...');
      
      // Get current center ID
      const centerId = parseInt(localStorage.getItem('centerId'));
      console.log('🏢 [useStaff] Current centerId:', centerId);
      
      if (!centerId) {
        console.warn('⚠️ [useStaff] No centerId found in localStorage');
        setStaffList([]);
        setLoading(false);
        return [];
      }
      
      // Fetch both roles in parallel
      const [technicians, staffMembers] = await Promise.all([
        API.getUsersByRole('TECHNICIAN'),
        API.getUsersByRole('STAFF')
      ]);
      
      console.log('📦 [useStaff] Raw API response:');
      console.log('   - All Technicians:', technicians.length);
      console.log('   - All Staff members:', staffMembers.length);
      
      // Combine both arrays
      const allStaff = [...technicians, ...staffMembers];
      console.log('📦 [useStaff] Total staff before filter:', allStaff.length);
      
      // Sample first user to see structure
      if (allStaff.length > 0) {
        console.log('👤 [useStaff] Sample user structure:', allStaff[0]);
      }
      
      // 🔧 TEMPORARY: Show ALL staff (no center filter)
      // TODO: Backend should add centerId to UserDto response or provide filtered endpoint
      const filteredStaff = allStaff; // Show all for now
      
      console.log(`✅ [useStaff] Total staff (all centers):`, filteredStaff.length);
      console.log(`   - ${filteredStaff.filter(s => s.role === 'TECHNICIAN').length} technicians`);
      console.log(`   - ${filteredStaff.filter(s => s.role === 'STAFF').length} staff`);
      
      setStaffList(filteredStaff);
      return filteredStaff;
    } catch (err) {
      console.error('❌ [useStaff] Error loading staff:', err);
      console.error('❌ [useStaff] Error details:', err.response?.data || err.message);
      setError(err.message || 'Failed to load staff');
      setStaffList([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new staff member
   * @param {Object} staffData - Staff data { fullName, email, phone, password, role }
   */
  const addStaff = async (staffData) => {
    try {
      console.log('➕ [useStaff] Adding new staff:', staffData);
      
      // Extract role from staffData
      const { role, ...employeeData } = staffData;
      
      // Call API with ROLE FIRST, then employee data
      console.log('📤 Calling API.createEmployee with:', { role, employeeData });
      const result = await API.createEmployee(role, employeeData);
      console.log('✅ [useStaff] Staff added successfully:', result);
      
      await fetchStaff(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useStaff] Error adding staff:', err);
      return { success: false, error: err.message || 'Failed to add staff' };
    }
  };

  /**
   * Update existing staff member
   * @param {Number} id - Staff ID
   * @param {Object} data - Updated data
   */
  const updateStaff = async (id, data) => {
    try {
      console.log('📝 [useStaff] Updating staff:', { id, data });
      const result = await API.updateUser(id, data);
      console.log('✅ [useStaff] Staff updated successfully:', result);
      await fetchStaff(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useStaff] Error updating staff:', err);
      return { success: false, error: err.message || 'Failed to update staff' };
    }
  };

  /**
   * Delete staff member
   * @param {Number} id - Staff ID
   */
  const deleteStaff = async (id) => {
    try {
      console.log('🗑️ [useStaff] Deleting staff:', id);
      const result = await API.deleteEmployee(id);
      console.log('✅ [useStaff] Staff deleted successfully:', result);
      await fetchStaff(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('❌ [useStaff] Error deleting staff:', err);
      return { success: false, error: err.message || 'Failed to delete staff' };
    }
  };

  /**
   * Get staff statistics
   */
  const getStats = () => {
    const techCount = staffList.filter(s => s.role === 'TECHNICIAN').length;
    const staffCount = staffList.filter(s => s.role === 'STAFF').length;
    
    return {
      totalStaff: staffList.length,
      technicians: techCount,
      staff: staffCount
    };
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    // Data
    staffList,
    loading,
    error,
    stats: getStats(),
    
    // Functions
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff
  };
};
