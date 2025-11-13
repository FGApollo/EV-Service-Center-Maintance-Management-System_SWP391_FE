import { useState, useEffect } from 'react';
import * as CenterAPI from '../../../services/centerAwareAPI';

export const useOverview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalVehicles: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    inProgressAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    activeTechnicians: 0,
    revenueData: {},
    profitData: {},
    trendingServices: [],
    trendingServicesLastMonth: [],
    trendingParts: []
  });

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel using CenterAPI
      const [
        customers,
        vehicles,
        appointments,
        revenue,
        profit,
        trendingServices,
        trendingServicesLastMonth,
        parts,
        technicians
      ] = await Promise.all([
        CenterAPI.getCustomers().catch(() => []),
        CenterAPI.getVehicles().catch(() => []),
        CenterAPI.getAppointments().catch(() => []),
        CenterAPI.getRevenueReport().catch(() => ({})),
        CenterAPI.getProfitReport().catch(() => ({})),
        CenterAPI.getTrendingServices().catch(() => []),
        CenterAPI.getTrendingServicesLastMonth().catch(() => []),
        CenterAPI.getParts().catch(() => []),
        CenterAPI.getTechnicians().catch(() => [])
      ]);

      // Calculate stats from fetched data
      const totalRevenue = Object.values(revenue).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];
      
      setStats({
        totalRevenue,
        totalCustomers: Array.isArray(customers) ? customers.length : 0,
        totalVehicles: Array.isArray(vehicles) ? vehicles.length : 0,
        totalAppointments: appointmentsArray.length,
        pendingAppointments: appointmentsArray.filter(a => a.status === 'PENDING').length,
        inProgressAppointments: appointmentsArray.filter(a => a.status === 'IN_PROGRESS').length,
        completedAppointments: appointmentsArray.filter(a => a.status === 'COMPLETED').length,
        cancelledAppointments: appointmentsArray.filter(a => a.status === 'CANCELLED').length,
        activeTechnicians: Array.isArray(technicians) ? technicians.length : 0,
        revenueData: revenue || {},
        profitData: profit || {},
        trendingServices: Array.isArray(trendingServices) ? trendingServices : [],
        trendingServicesLastMonth: Array.isArray(trendingServicesLastMonth) ? trendingServicesLastMonth : [],
        trendingParts: Array.isArray(parts) ? parts : []
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch overview data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchOverviewData
  };
};
