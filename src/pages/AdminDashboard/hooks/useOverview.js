import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useOverview = () => {
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalManagers: 0,
    totalTechnicians: 0,
    totalCustomers: 0,
    totalCenters: 0,
    totalVehicles: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    revenue: { thisMonth: 0, lastMonth: 0, percentChange: 0 },
    profit: { thisMonth: 0 }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Admin Overview] Fetching overview data...');

      // Fetch data in parallel
      const results = await Promise.allSettled([
        API.getAllCustomers().catch(() => []),
        API.getVehicles().catch(() => []),
        API.getAllAppointments().catch(() => []),
        API.getRevenueCurrentMonth().catch(() => ({ thisMonth: 0, lastMonth: 0, percentChange: 0 })),
        API.getCurrentMonthExpense().catch(() => 0)
      ]);

      const [
        customersResult,
        vehiclesResult,
        appointmentsResult,
        revenueResult,
        expenseResult
      ] = results;

      const customers = customersResult.status === 'fulfilled' ? customersResult.value : [];
      const vehicles = vehiclesResult.status === 'fulfilled' ? vehiclesResult.value : [];
      const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [];
      const revenue = revenueResult.status === 'fulfilled' ? revenueResult.value : { thisMonth: 0, lastMonth: 0, percentChange: 0 };
      const expense = expenseResult.status === 'fulfilled' ? expenseResult.value : 0;

      // Count users by role
      const staff = customers.filter(u => u.role === 'STAFF').length;
      const managers = customers.filter(u => u.role === 'MANAGER').length;
      const technicians = customers.filter(u => u.role === 'TECHNICIAN').length;
      const customersOnly = customers.filter(u => u.role === 'CUSTOMER').length;

      // Count appointments by status
      const pending = appointments.filter(a => a.status === 'PENDING' || a.status === 'pending').length;
      const completed = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'completed' || a.status === 'DONE' || a.status === 'done').length;

      const profit = (revenue.thisMonth || 0) - (expense || 0);

      setOverviewData({
        totalUsers: customers.length,
        totalStaff: staff,
        totalManagers: managers,
        totalTechnicians: technicians,
        totalCustomers: customersOnly,
        totalCenters: 0, // TODO: Add API for centers
        totalVehicles: vehicles.length,
        totalAppointments: appointments.length,
        pendingAppointments: pending,
        completedAppointments: completed,
        revenue: revenue,
        profit: { thisMonth: profit }
      });

      setLoading(false);
      console.log('✅ [Admin Overview] Data loaded');
    } catch (err) {
      console.error('❌ [Admin Overview] Error:', err);
      setError(err.message || 'Failed to load overview data');
      setLoading(false);
    }
  }, []);

  return {
    overviewData,
    loading,
    error,
    fetchOverviewData
  };
};
