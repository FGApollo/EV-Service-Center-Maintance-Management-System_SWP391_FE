import React, { useState, useEffect } from 'react';
import './TechnicianDashboard.css';
import { FaClock, FaTools, FaCheckCircle, FaUser, FaCar, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { getAppointmentsForStaff, startAppointment, completeAppointment, getVehicleById } from '../api';

function TechnicianDashboard({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehiclesCache, setVehiclesCache] = useState({});

  // Lấy thông tin technician từ localStorage
  const [technicianCenterId, setTechnicianCenterId] = useState(null);

  // Helper function để normalize status (hỗ trợ cả lowercase và uppercase)
  const normalizeStatus = (status) => {
    if (!status) return '';
    return String(status).toLowerCase();
  };

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        const centerId = userData.center_id || userData.centerId;
        setTechnicianCenterId(centerId);
        console.log('🏢 Technician Center ID:', centerId);
      }
    } catch (error) {
      console.error('Lỗi khi đọc thông tin user:', error);
    }
  }, []);

  // Fetch appointments khi component mount
  useEffect(() => {
    fetchAppointments();
  }, [technicianCenterId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Đang tải danh sách lịch hẹn...');
      
      // Lấy tất cả appointments
      const data = await getAppointmentsForStaff(null);
      console.log('📦 Dữ liệu từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        return;
      }
      
      // Log tất cả status để debug
      console.log('📊 Các status trong data:', [...new Set(data.map(apt => apt.status))]);
      console.log('📋 Chi tiết appointments:', data.map(apt => ({
        id: apt.id || apt.appointmentId,
        status: apt.status,
        centerId: apt.serviceCenterId || apt.service_center_id || apt.centerId || apt.center_id
      })));
      
      // Lọc lịch hẹn theo center_id và chỉ lấy accepted + in_progress + completed
      let filteredData = data.filter(apt => {
        const status = apt.status;
        // Chỉ lấy appointments đã được staff duyệt (accepted)
        const isValidStatus = ['accepted', 'in-progress', 'in_progress', 'inProgress', 'completed', 'done'].includes(status);
        if (!isValidStatus) {
          console.log(`⚠️ Loại bỏ appointment #${apt.id || apt.appointmentId} với status: ${status}`);
        }
        return isValidStatus;
      });

      console.log('✅ Sau khi lọc status, còn:', filteredData.length, 'appointments');
      
      // Lọc theo center nếu có
      if (technicianCenterId !== null && technicianCenterId !== undefined) {
        const beforeCenterFilter = filteredData.length;
        filteredData = filteredData.filter(appointment => {
          const aptCenterId = appointment.serviceCenterId || appointment.service_center_id || appointment.centerId || appointment.center_id;
          const matched = aptCenterId === technicianCenterId;
          if (!matched) {
            console.log(`⚠️ Loại bỏ appointment #${appointment.id || appointment.appointmentId} - center ${aptCenterId} không khớp với ${technicianCenterId}`);
          }
          return matched;
        });
        console.log(`✅ Đã lọc theo center_id ${technicianCenterId}: ${beforeCenterFilter} → ${filteredData.length}`);
      }
      
      console.log('📊 Tổng số lịch hẹn cuối cùng:', filteredData.length);
      console.log('📋 Breakdown theo status:', {
        accepted: filteredData.filter(a => normalizeStatus(a.status) === 'accepted').length,
        inProgress: filteredData.filter(a => {
          const normalized = normalizeStatus(a.status);
          return ['in-progress', 'in_progress', 'inprogress'].includes(normalized);
        }).length,
        completed: filteredData.filter(a => {
          const normalized = normalizeStatus(a.status);
          return ['completed', 'done'].includes(normalized);
        }).length,
      });
      setAppointments(filteredData);
      
      // Fetch thông tin xe
      const vehicleIds = [...new Set(filteredData.map(apt => apt.vehicleId).filter(Boolean))];
      fetchVehicleInfo(vehicleIds);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách lịch hẹn:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch thông tin xe
  const fetchVehicleInfo = async (vehicleIds) => {
    const newCache = { ...vehiclesCache };
    
    for (const vehicleId of vehicleIds) {
      if (!newCache[vehicleId]) {
        try {
          const vehicleInfo = await getVehicleById(vehicleId);
          newCache[vehicleId] = vehicleInfo;
          console.log(`✅ Loaded vehicle #${vehicleId}:`, vehicleInfo);
        } catch (err) {
          console.error(`❌ Failed to load vehicle #${vehicleId}:`, err);
          newCache[vehicleId] = { error: true, vehicleId };
        }
      }
    }
    
    setVehiclesCache(newCache);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      console.log(`🔄 Đang cập nhật trạng thái: ${appointmentId} -> ${newStatus}`);
      
      // Gọi API tương ứng
      if (newStatus === 'in-progress') {
        await startAppointment(appointmentId);
      } else if (newStatus === 'completed') {
        await completeAppointment(appointmentId);
      }
      
      // Refresh danh sách
      await fetchAppointments();
      
      // Cập nhật selectedAppointment
      if (selectedAppointment?.id === appointmentId || selectedAppointment?.appointmentId === appointmentId) {
        const updatedAppointment = appointments.find(apt => 
          (apt.id === appointmentId || apt.appointmentId === appointmentId)
        );
        if (updatedAppointment) {
          setSelectedAppointment({ ...updatedAppointment, status: newStatus });
        }
      }
      
      alert(`✅ Đã cập nhật trạng thái thành công!`);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
      alert(`❌ Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch(normalized) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-waiting';
      case 'in-progress':
      case 'in_progress':
      case 'inprogress': return 'status-in-progress';
      case 'completed':
      case 'done': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    const normalized = normalizeStatus(status);
    switch(normalized) {
      case 'pending': return 'Chờ xác nhận';
      case 'accepted': return 'Đã xác nhận';
      case 'in-progress':
      case 'in_progress':
      case 'inprogress': return 'Đang làm';
      case 'completed':
      case 'done': return 'Hoàn tất';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    const normalized = normalizeStatus(status);
    switch(normalized) {
      case 'pending': return <FaClock />;
      case 'accepted': return <FaCheckCircle />;
      case 'in-progress':
      case 'in_progress':
      case 'inprogress': return <FaTools />;
      case 'completed':
      case 'done': return <FaCheckCircle />;
      default: return <FaClock />;
    }
  };

  // Đếm số lượng theo trạng thái
  const waitingCount = appointments.filter(a => normalizeStatus(a.status) === 'accepted').length;
  const inProgressCount = appointments.filter(a => {
    const normalized = normalizeStatus(a.status);
    return ['in-progress', 'in_progress', 'inprogress'].includes(normalized);
  }).length;
  const completedCount = appointments.filter(a => {
    const normalized = normalizeStatus(a.status);
    return ['completed', 'done'].includes(normalized);
  }).length;

  return (
    <div className="technician-dashboard">
      {/* Header */}
      <div className="technician-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Quay lại
          </button>
          <h1>Dashboard Kỹ Thuật Viên</h1>
        </div>
        <div className="header-right">
          <div className="technician-info">
            <div className="technician-avatar">
              <FaUser />
            </div>
            <div className="technician-details">
              <p className="technician-name">Kỹ thuật viên</p>
              <p className="technician-role">
                Quản lý công việc
                {technicianCenterId !== null && technicianCenterId !== undefined && (
                  <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#4CAF50', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    Chi nhánh {technicianCenterId}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Status Cards */}
        <div className="status-cards">
          <div className="status-card waiting">
            <div className="status-card-icon">
              <FaCheckCircle />
            </div>
            <div className="status-card-info">
              <h2>{waitingCount}</h2>
              <p>Đã xác nhận</p>
            </div>
          </div>

          <div className="status-card in-progress">
            <div className="status-card-icon">
              <FaTools />
            </div>
            <div className="status-card-info">
              <h2>{inProgressCount}</h2>
              <p>Đang làm</p>
            </div>
          </div>

          <div className="status-card completed">
            <div className="status-card-icon">
              <FaCheckCircle />
            </div>
            <div className="status-card-info">
              <h2>{completedCount}</h2>
              <p>Hoàn tất</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Appointments List */}
          <div className="appointments-list">
            <h3>Danh sách công việc ({appointments.length})</h3>
            <div className="list-items">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Đang tải danh sách...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>❌ {error}</p>
                  <button className="retry-btn" onClick={fetchAppointments}>
                    Thử lại
                  </button>
                </div>
              ) : appointments.length === 0 ? (
                <div className="empty-state">
                  <FaTools size={40} />
                  <p>Chưa có công việc nào</p>
                </div>
              ) : (
                appointments.map(appointment => {
                  const appointmentId = appointment.id || appointment.appointmentId;
                  const appointmentDate = appointment.appointmentDate 
                    ? new Date(appointment.appointmentDate).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A';
                  
                  const vehicle = vehiclesCache[appointment.vehicleId];
                  const vehicleDisplay = vehicle && !vehicle.error
                    ? `${vehicle.model || vehicle.brand || ''} ${vehicle.licensePlate ? `- ${vehicle.licensePlate}` : ''}`.trim()
                    : (appointment.carInfo || appointment.car_info || `Xe #${appointment.vehicleId || 'N/A'}`);
                  
                  return (
                    <div 
                      key={appointmentId}
                      className={`appointment-item ${selectedAppointment?.appointmentId === appointmentId || selectedAppointment?.id === appointmentId ? 'active' : ''}`}
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="appointment-header">
                        <h4>
                          {appointment.fullName || 
                           appointment.customerName || 
                           appointment.customer_name || 
                           `Khách hàng #${appointment.customerId || 'N/A'}`}
                        </h4>
                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="car-info">
                        🚗 {vehicleDisplay}
                      </p>
                      <p className="service-type">
                        🔧 {appointment.serviceType || 
                         appointment.service || 
                         appointment.serviceName ||
                         'Dịch vụ bảo dưỡng'}
                      </p>
                      <div className="appointment-time">
                        <FaCalendarAlt />
                        <span>{appointmentDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="appointment-details">
            {selectedAppointment ? (
              <>
                <div className="details-header">
                  <div>
                    <h2>Chi tiết công việc #{selectedAppointment.appointmentId || selectedAppointment.id}</h2>
                    <span className={`status-badge large ${getStatusColor(selectedAppointment.status)}`}>
                      {getStatusIcon(selectedAppointment.status)}
                      {getStatusText(selectedAppointment.status)}
                    </span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Thông tin khách hàng</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaUser />
                      <div>
                        <span className="label">Tên khách hàng</span>
                        <span className="value">
                          {selectedAppointment.fullName || 
                           selectedAppointment.customerName || 
                           `Khách hàng #${selectedAppointment.customerId || 'N/A'}`}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaPhone />
                      <div>
                        <span className="label">Số điện thoại</span>
                        <span className="value">
                          {selectedAppointment.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaEnvelope />
                      <div>
                        <span className="label">Email</span>
                        <span className="value">
                          {selectedAppointment.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Thông tin xe và dịch vụ</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCar />
                      <div>
                        <span className="label">Thông tin xe</span>
                        <span className="value">
                          {(() => {
                            const vehicle = vehiclesCache[selectedAppointment.vehicleId];
                            if (vehicle && !vehicle.error) {
                              return (
                                <div>
                                  <div>{vehicle.model || `${vehicle.brand || ''}`}</div>
                                  {vehicle.licensePlate && (
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                                      Biển số: {vehicle.licensePlate}
                                    </div>
                                  )}
                                  {vehicle.vin && (
                                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                                      VIN: {vehicle.vin}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return selectedAppointment.carInfo || 
                                   selectedAppointment.car_info || 
                                   `Xe #${selectedAppointment.vehicleId || 'N/A'}`;
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaTools />
                      <div>
                        <span className="label">Loại dịch vụ</span>
                        <span className="value">
                          {selectedAppointment.serviceType || 
                           selectedAppointment.service || 
                           selectedAppointment.serviceName || 
                           'Bảo dưỡng định kỳ'}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <span className="label">Ngày hẹn</span>
                        <span className="value">
                          {selectedAppointment.appointmentDate 
                            ? new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedAppointment.assignedBy || selectedAppointment.assigned_by) && (
                  <div className="details-section">
                    <h3>Thông tin phân công</h3>
                    <div style={{ 
                      padding: '15px', 
                      background: '#e3f2fd', 
                      border: '1px solid #2196F3',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#1565C0'
                    }}>
                      <p style={{ margin: 0 }}>
                        ✅ Công việc này đã được giao bởi staff
                      </p>
                    </div>
                  </div>
                )}

                <div className="details-section">
                  <h3>Ghi chú</h3>
                  <div className="notes-box">
                    <p>{selectedAppointment.notes || 'Không có ghi chú'}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Thao tác</h3>
                  <div className="action-buttons">
                    {(normalizeStatus(selectedAppointment.status) === 'accepted') && (
                      <button 
                        className="action-btn start"
                        onClick={() => handleStatusChange(
                          selectedAppointment.appointmentId || selectedAppointment.id, 
                          'in-progress'
                        )}
                      >
                        <FaTools />
                        Bắt đầu làm việc
                      </button>
                    )}
                    {['in-progress', 'in_progress', 'inProgress'].includes(selectedAppointment.status) && (
                      <button 
                        className="action-btn complete"
                        onClick={() => handleStatusChange(
                          selectedAppointment.appointmentId || selectedAppointment.id, 
                          'completed'
                        )}
                      >
                        <FaCheckCircle />
                        Hoàn thành
                      </button>
                    )}
                    {['completed', 'done'].includes(selectedAppointment.status) && (
                      <div className="completed-message">
                        <FaCheckCircle style={{ color: '#48bb78', fontSize: '24px' }} />
                        <p>Công việc đã hoàn thành!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FaTools size={60} />
                <p>Chọn một công việc để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;

