import { useState, useEffect, useCallback } from 'react';
import * as API from '../../../api/index';
import { getCurrentCenterId } from '../../../utils/centerFilter';
import { showSuccess, showError } from '../../../utils/toast';

/**
 * Custom Hook: useInvoices
 * Quản lý danh sách hóa đơn của center
 */
export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const centerId = getCurrentCenterId();

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await API.getInvoices();
      
      // Backend trả về array trực tiếp với camelCase fields
      let invoicesArray = Array.isArray(data) ? data : [];

      // Hiển thị tất cả invoices (không filter)
      setInvoices(invoicesArray);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi tải danh sách hóa đơn';
      setError(errorMessage);
      setLoading(false);
      showError(errorMessage);
    }
  }, [centerId]);

  // Fetch invoice detail
  const fetchInvoiceDetail = useCallback(async (invoiceId) => {
    try {
      const data = await API.getInvoiceDetail(invoiceId);
      return data;
    } catch (err) {
      console.error('Error fetching invoice detail:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi tải chi tiết hóa đơn';
      showError(errorMessage);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
    fetchInvoiceDetail
  };
};

