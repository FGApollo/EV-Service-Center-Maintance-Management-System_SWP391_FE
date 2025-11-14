import { useCallback, useEffect, useState } from "react";
import { getAppointments } from "../api";

// Map status từ API sang tiếng Việt
const mapStatusToVietnamese = (status) => {
  const statusMap = {
    COMPLETED: "Hoàn thành",
    DONE: "Hoàn thành",
    IN_PROGRESS: "Đang xử lý",
    INPROGRESS: "Đang xử lý",
    PENDING: "Đang xử lý",
    ACCEPTED: "Đang xử lý",
    CANCELLED: "Đã hủy",
    CANCELED: "Đã hủy",
  };

  if (!status) return "Chưa xác định";
  
  const upperStatus = status.toString().toUpperCase();
  return statusMap[upperStatus] || status;
};

// Format cost thành VNĐ
const formatCost = (cost) => {
  if (!cost || cost === 0) return "Chưa xác định";
  return `${cost.toLocaleString("vi-VN")} VNĐ`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa xác định";
    
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Chưa xác định";
  }
};

const useBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookingHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAppointments();
      
      // Transform API data to match component format
      const transformedData = (data || []).map((appointment) => ({
        id: appointment.appointmentId,
        date: formatDate(appointment.appointmentDate),
        service: appointment.serviceTypeName || "Dịch vụ bảo trì",
        status: mapStatusToVietnamese(appointment.status),
        price: formatCost(appointment.cost),
        // Additional fields for details view
        rawStatus: appointment.status,
        rawDate: appointment.appointmentDate,
        rawCost: appointment.cost,
        serviceCenterName: appointment.serviceCenterName || "Chưa xác định",
        vehicleModel: appointment.vehicleModel || "Chưa xác định",
      }));
      
      // Sort by date descending (newest first)
      transformedData.sort((a, b) => {
        const dateA = new Date(a.rawDate);
        const dateB = new Date(b.rawDate);
        return dateB - dateA;
      });
      
      setBookingHistory(transformedData);
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch sử đặt lịch:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Không thể tải lịch sử đặt lịch"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookingHistory();
  }, [loadBookingHistory]);

  const retry = () => {
    loadBookingHistory();
  };

  return {
    bookingHistory,
    loading,
    error,
    retry,
  };
};

export default useBookingHistory;

