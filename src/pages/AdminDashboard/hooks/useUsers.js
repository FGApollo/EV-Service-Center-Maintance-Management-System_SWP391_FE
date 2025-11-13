import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Admin Users] Fetching users...');

      const data = await API.getAllCustomers();
      setUsers(data || []);
      
      console.log('✅ [Admin Users] Loaded users:', data?.length);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('❌ [Admin Users] Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      setLoading(false);
      return [];
    }
  }, []);

  // Add new employee (staff/manager/technician)
  const addEmployee = useCallback(async (role, userData) => {
    try {
      setError(null);
      console.log('➕ [Admin Users] Adding employee:', role, userData);

      const result = await API.createEmployee(role, userData);
      
      // Refresh user list
      await fetchUsers();
      
      console.log('✅ [Admin Users] Employee added successfully');
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [Admin Users] Error adding employee:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add employee';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      setError(null);
      console.log('📝 [Admin Users] Updating user:', userId, userData);

      const result = await API.updateUser(userId, userData);
      
      // Refresh user list
      await fetchUsers();
      
      console.log('✅ [Admin Users] User updated successfully');
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [Admin Users] Error updating user:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchUsers]);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      setError(null);
      console.log('🗑️ [Admin Users] Deleting user:', userId);

      await API.deleteEmployee(userId);
      
      // Refresh user list
      await fetchUsers();
      
      console.log('✅ [Admin Users] User deleted successfully');
      return { success: true };
    } catch (err) {
      console.error('❌ [Admin Users] Error deleting user:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addEmployee,
    updateUser,
    deleteUser
  };
};
