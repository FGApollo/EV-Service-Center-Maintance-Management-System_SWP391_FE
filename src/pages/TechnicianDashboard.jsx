import React, { useState, useEffect } from 'react';
import './TechnicianDashboard.css';
import { FaClock, FaTools, FaCheckCircle, FaUser, FaCar, FaCalendarAlt, FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import { getAppointmentsForStaff, startAppointment, completeAppointment, getVehicleById, getAppointmentDetailWithTechs } from '../api';

function TechnicianDashboard({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehiclesCache, setVehiclesCache] = useState({});
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'accepted', 'in_progress', 'completed'
  const [checklistStates, setChecklistStates] = useState({}); // Track checklist status for each appointment

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
      
      // Lọc lịch hẹn theo center_id và chỉ lấy accepted + in_progress + completed
      let filteredData = data.filter(apt => {
        const status = apt.status;
        const isValidStatus = ['accepted', 'in-progress', 'in_progress', 'inProgress', 'completed', 'done'].includes(status);
        return isValidStatus;
      });

      console.log('✅ Sau khi lọc status, còn:', filteredData.length, 'appointments');
      
      // Lọc theo center nếu có
      if (technicianCenterId !== null && technicianCenterId !== undefined) {
        const beforeCenterFilter = filteredData.length;
        filteredData = filteredData.filter(appointment => {
          const aptCenterId = appointment.serviceCenterId || appointment.service_center_id || appointment.centerId || appointment.center_id;
          return aptCenterId === technicianCenterId;
        });
        console.log(`✅ Đã lọc theo center_id ${technicianCenterId}: ${beforeCenterFilter} → ${filteredData.length}`);
      }
      
      console.log('📊 Tổng số lịch hẹn cuối cùng:', filteredData.length);
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

  // Load chi tiết appointment từ API với checkList và đầy đủ thông tin
  const loadAppointmentDetail = async (appointmentId) => {
    try {
      console.log('📞 Loading appointment detail:', appointmentId);
      const detailData = await getAppointmentDetailWithTechs(appointmentId);
      console.log('✅ Appointment detail loaded:', detailData);

      // Parse checkList từ API (array of strings) thành format có status
      let parsedChecklist = [];
      if (detailData.checkList && Array.isArray(detailData.checkList)) {
        parsedChecklist = detailData.checkList.map((item, index) => ({
          item: item,
          status: 'pending' // Default status
        }));

        // Auto-complete items based on appointment status
        const status = normalizeStatus(detailData.status);
        if (status === 'completed' || status === 'done') {
          parsedChecklist = parsedChecklist.map(item => ({ ...item, status: 'completed' }));
        } else if (['in-progress', 'in_progress', 'inprogress'].includes(status)) {
          // Mark first item as completed, second as in-progress
          parsedChecklist = parsedChecklist.map((item, idx) => ({
            ...item,
            status: idx === 0 ? 'completed' : idx === 1 ? 'in-progress' : 'pending'
          }));
        }

        // Check if we have saved checklist state for this appointment
        const savedState = checklistStates[appointmentId];
        if (savedState) {
          // Merge saved state with API data
          parsedChecklist = parsedChecklist.map((item, idx) => ({
            ...item,
            status: savedState[idx]?.status || item.status
          }));
        }
      }

      // Extract VIN from users[0].vehicles[0].vin nếu có
      let vehicleVin = detailData.vin || null;
      if (!vehicleVin && detailData.users && detailData.users.length > 0) {
        const firstUser = detailData.users[0];
        if (firstUser.vehicles && firstUser.vehicles.length > 0) {
          vehicleVin = firstUser.vehicles[0].vin;
        }
      }

      // Merge detail data with checklist
      const enhancedData = {
        ...detailData,
        id: detailData.appointmentId,
        appointmentId: detailData.appointmentId,
        checklist: parsedChecklist,
        vin: vehicleVin,
        fullName: detailData.customerName,
        customerName: detailData.customerName,
        carInfo: detailData.vehicleModel,
        serviceType: detailData.serviceNames?.join(', ') || 'Bảo dưỡng',
        service: detailData.serviceNames?.join(', ') || 'Bảo dưỡng'
      };

      console.log('✅ Enhanced appointment data:', enhancedData);
      return enhancedData;
    } catch (error) {
      console.error('❌ Error loading appointment detail:', error);
      return null;
    }
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
      
      // Cập nhật selectedMaintenance
      if (selectedMaintenance?.id === appointmentId || selectedMaintenance?.appointmentId === appointmentId) {
        const updatedAppointment = appointments.find(apt => 
          (apt.id === appointmentId || apt.appointmentId === appointmentId)
        );
        if (updatedAppointment) {
          setSelectedMaintenance({ ...updatedAppointment, status: newStatus });
        }
      }
      
      alert(`✅ Đã cập nhật trạng thái thành công!`);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
      alert(`❌ Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`);
    }
  };

  // Xử lý cập nhật checklist
  const handleChecklistUpdate = (appointmentId, checklistIndex, newStatus) => {
    // Update checklistStates
    setChecklistStates(prev => {
      const currentState = prev[appointmentId] || {};
      return {
        ...prev,
        [appointmentId]: {
          ...currentState,
          [checklistIndex]: { status: newStatus }
        }
      };
    });

    // Update selected maintenance immediately
    if (selectedMaintenance && (selectedMaintenance.id === appointmentId || selectedMaintenance.appointmentId === appointmentId)) {
      const updatedChecklist = [...selectedMaintenance.checklist];
      updatedChecklist[checklistIndex] = { ...updatedChecklist[checklistIndex], status: newStatus };
      setSelectedMaintenance({ ...selectedMaintenance, checklist: updatedChecklist });
    }

    // TODO: Call API to save checklist update if backend supports it
    console.log(`✅ Updated checklist item #${checklistIndex} to ${newStatus}`);
  };

  // Xử lý click vào maintenance item để load detail
  const handleMaintenanceItemClick = async (appointment) => {
    const appointmentId = appointment.id || appointment.appointmentId;
    
    // Set selected immediately để hiển thị UI (với loading state có thể thêm sau)
    setSelectedMaintenance({ ...appointment, loading: true });
    
    // Load chi tiết từ API
    const detailData = await loadAppointmentDetail(appointmentId);
    
    if (detailData) {
      setSelectedMaintenance(detailData);
    } else {
      // Fallback: use getAppointmentWithChecklist
      setSelectedMaintenance(getAppointmentWithChecklist(appointment));
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

  // Lọc appointments theo statusFilter
  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter === 'all') return true;
    
    const normalized = normalizeStatus(apt.status);
    
    if (statusFilter === 'accepted') {
      return normalized === 'accepted';
    } else if (statusFilter === 'in_progress') {
      return ['in-progress', 'in_progress', 'inprogress'].includes(normalized);
    } else if (statusFilter === 'completed') {
      return ['completed', 'done'].includes(normalized);
    }
    
    return true;
  });

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

  // Tạo checklist mặc định cho appointment nếu chưa có
  const getAppointmentWithChecklist = (appointment) => {
    if (!appointment) return null;
    
    if (appointment.checklist && appointment.checklist.length > 0) {
      return appointment;
    }

    // Tạo checklist mặc định dựa trên loại dịch vụ
    const defaultChecklist = [
      { item: 'Kiểm tra pin', status: 'pending' },
      { item: 'Kiểm tra phanh', status: 'pending' },
      { item: 'Kiểm tra lốp xe', status: 'pending' },
      { item: 'Kiểm tra hệ thống điện', status: 'pending' },
      { item: 'Vệ sinh nội thất', status: 'pending' }
    ];

    // Auto-complete items based on status
    if (normalizeStatus(appointment.status) === 'completed') {
      return {
        ...appointment,
        checklist: defaultChecklist.map(item => ({ ...item, status: 'completed' }))
      };
    } else if (['in-progress', 'in_progress', 'inprogress'].includes(normalizeStatus(appointment.status))) {
      return {
        ...appointment,
        checklist: defaultChecklist.map((item, idx) => ({
          ...item,
          status: idx === 0 ? 'completed' : idx === 1 ? 'in-progress' : 'pending'
        }))
      };
    }

    return {
      ...appointment,
      checklist: defaultChecklist
    };
  };

  // Tạo car condition mặc định
  const getCarCondition = (appointment) => {
    if (appointment?.carCondition) {
      return appointment.carCondition;
    }

    return {
      exterior: 'Đang kiểm tra',
      interior: 'Đang kiểm tra',
      battery: 'Đang kiểm tra',
      tire: 'Đang kiểm tra',
      notes: 'Chưa có ghi chú'
    };
  };

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
          <h1>Quy trình Bảo dưỡng - Kỹ Thuật Viên</h1>
        </div>
        <div className="header-right">
          <div className="technician-info-header">
            <div className="technician-avatar">
              <FaUser />
            </div>
            <div className="technician-details">
              <p className="technician-name">Kỹ thuật viên</p>
              <p className="technician-role">
                Quản lý quy trình bảo dưỡng
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
        {/* Status Cards - Clickable filters */}
        <div className="maintenance-stats">
          <div 
            className={`stat-card waiting ${statusFilter === 'accepted' ? 'active-filter' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'accepted' ? 'all' : 'accepted')}
            style={{ cursor: 'pointer' }}
          >
              <FaCheckCircle />
            <div>
              <h4>{waitingCount}</h4>
              <p>Đã xác nhận</p>
            </div>
          </div>

          <div 
            className={`stat-card in-progress ${statusFilter === 'in_progress' ? 'active-filter' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
            style={{ cursor: 'pointer' }}
          >
              <FaTools />
            <div>
              <h4>{inProgressCount}</h4>
              <p>Đang làm</p>
            </div>
          </div>

          <div 
            className={`stat-card completed ${statusFilter === 'completed' ? 'active-filter' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
            style={{ cursor: 'pointer' }}
          >
              <FaCheckCircle />
            <div>
              <h4>{completedCount}</h4>
              <p>Hoàn tất</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="content-layout">
          {/* Maintenance List */}
          <div className="maintenance-list">
            <div className="list-header">
              <h3>
                Danh sách phiếu dịch vụ ({filteredAppointments.length})
                {statusFilter !== 'all' && (
                  <button 
                    className="clear-filter-btn" 
                    onClick={() => setStatusFilter('all')}
                    title="Xóa bộ lọc"
                  >
                    ✕ Xóa lọc
                  </button>
                )}
              </h3>
            </div>
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
              ) : filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <FaTools size={40} />
                  <p>
                    {statusFilter === 'all' 
                      ? 'Chưa có công việc nào' 
                      : 'Không có công việc nào với bộ lọc này'}
                  </p>
                </div>
              ) : (
                filteredAppointments.map(appointment => {
                  const appointmentId = appointment.id || appointment.appointmentId;
                  const vehicle = vehiclesCache[appointment.vehicleId];
                  const carInfo = vehicle && !vehicle.error
                    ? `${vehicle.model || vehicle.brand || ''} - ${vehicle.licensePlate || ''}`.trim()
                    : (appointment.carInfo || appointment.car_info || `Xe #${appointment.vehicleId || 'N/A'}`);
                  
                  return (
                    <div 
                      key={appointmentId}
                      className={`maintenance-item ${(selectedMaintenance?.id === appointmentId || selectedMaintenance?.appointmentId === appointmentId) ? 'active' : ''}`}
                      onClick={() => handleMaintenanceItemClick(appointment)}
                    >
                      <div className="maintenance-header">
                        <div>
                          <h4>#{appointmentId}</h4>
                          <p className="customer-name">
                          {appointment.fullName || 
                           appointment.customerName || 
                           appointment.customer_name || 
                           `Khách hàng #${appointment.customerId || 'N/A'}`}
                          </p>
                        </div>
                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="car-info">🚗 {carInfo}</p>
                      <p className="service-type">
                        🔧 {appointment.serviceType || 
                         appointment.service || 
                         appointment.serviceName ||
                         'Dịch vụ bảo dưỡng'}
                      </p>
                      <div className="maintenance-footer">
                        <span className="time">
                          <FaClock style={{ marginRight: '5px' }} />
                          {appointment.appointmentDate 
                            ? new Date(appointment.appointmentDate).toLocaleString('vi-VN', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Maintenance Details */}
          <div className="maintenance-details">
            {selectedMaintenance ? (
              <>
                <div className="details-header">
                  <div>
                    <h2>Phiếu dịch vụ #{selectedMaintenance.id || selectedMaintenance.appointmentId}</h2>
                    <span className={`status-badge large ${getStatusColor(selectedMaintenance.status)}`}>
                      {getStatusText(selectedMaintenance.status)}
                    </span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Thông tin chung</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaUser />
                      <div>
                        <span className="label">Khách hàng</span>
                        <span className="value">
                          {selectedMaintenance.fullName || 
                           selectedMaintenance.customerName || 
                           `Khách hàng #${selectedMaintenance.customerId || 'N/A'}`}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaCar />
                      <div>
                        <span className="label">Xe</span>
                        <span className="value">
                          {(() => {
                            // Priority 1: vehicleModel from API detail
                            if (selectedMaintenance.vehicleModel) {
                              return selectedMaintenance.vehicleModel;
                            }
                            // Priority 2: carInfo từ enhanced data
                            if (selectedMaintenance.carInfo) {
                              return selectedMaintenance.carInfo;
                            }
                            // Priority 3: vehiclesCache
                            const vehicle = vehiclesCache[selectedMaintenance.vehicleId];
                            if (vehicle && !vehicle.error) {
                              return `${vehicle.model || vehicle.brand || ''} - ${vehicle.licensePlate || ''}`.trim();
                            }
                            // Fallback
                            return `Xe #${selectedMaintenance.vehicleId || 'N/A'}`;
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaPhone />
                      <div>
                        <span className="label">Số điện thoại</span>
                        <span className="value">{selectedMaintenance.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaClock />
                      <div>
                        <span className="label">Ngày hẹn</span>
                        <span className="value">
                          {selectedMaintenance.appointmentDate 
                            ? new Date(selectedMaintenance.appointmentDate).toLocaleString('vi-VN')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>VIN Number</h3>
                  <div className="vin-box">
                    <code>
                      {(() => {
                        // Priority 1: VIN from API detail (already includes users[0].vehicles[0].vin)
                        if (selectedMaintenance.vin) {
                          return selectedMaintenance.vin;
                        }
                        // Priority 2: VIN from vehiclesCache
                        const vehicle = vehiclesCache[selectedMaintenance.vehicleId];
                        if (vehicle?.vin) {
                          return vehicle.vin;
                        }
                        // Fallback
                        return 'N/A';
                      })()}
                    </code>
                  </div>
                </div>

                  <div className="details-section">
                  <h3>Checklist EV - {selectedMaintenance.serviceType || selectedMaintenance.service || 'Bảo dưỡng'}</h3>
                  <div className="checklist">
                    {selectedMaintenance.checklist && selectedMaintenance.checklist.map((item, index) => (
                      <div key={index} className={`checklist-item ${item.status}`}>
                        <div className="checklist-info">
                          {item.status === 'completed' && <FaCheckCircle className="icon completed" />}
                          {item.status === 'in-progress' && <FaClock className="icon in-progress" />}
                          {normalizeStatus(item.status) === 'pending' && <FaClock className="icon pending" />}
                          <span>{item.item}</span>
                        </div>
                        <div className="checklist-actions">
                          {item.status !== 'completed' && (
                            <>
                              {item.status !== 'in-progress' && (
                                <button 
                                  className="btn-small start"
                                  onClick={() => handleChecklistUpdate(
                                    selectedMaintenance.id || selectedMaintenance.appointmentId, 
                                    index, 
                                    'in-progress'
                                  )}
                                >
                                  Bắt đầu
                                </button>
                              )}
                              <button 
                                className="btn-small complete"
                                onClick={() => handleChecklistUpdate(
                                  selectedMaintenance.id || selectedMaintenance.appointmentId, 
                                  index, 
                                  'completed'
                                )}
                              >
                                Hoàn thành
                              </button>
                            </>
                          )}
                        </div>
                    </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Tình trạng xe</h3>
                  <div className="car-condition">
                    {(() => {
                      const condition = getCarCondition(selectedMaintenance);
                      return (
                        <>
                          <div className="condition-item">
                            <strong>Ngoại thất:</strong>
                            <span>{condition.exterior}</span>
                          </div>
                          <div className="condition-item">
                            <strong>Nội thất:</strong>
                            <span>{condition.interior}</span>
                          </div>
                          <div className="condition-item">
                            <strong>Pin:</strong>
                            <span>{condition.battery}</span>
                          </div>
                          <div className="condition-item">
                            <strong>Lốp xe:</strong>
                            <span>{condition.tire}</span>
                          </div>
                          <div className="condition-notes">
                            <strong>Ghi chú:</strong>
                            <p>{condition.notes}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Cập nhật trạng thái</h3>
                  <div className="action-buttons">
                    {normalizeStatus(selectedMaintenance.status) === 'accepted' && (
                      <button 
                        className="action-btn start"
                        onClick={() => handleStatusChange(
                          selectedMaintenance.id || selectedMaintenance.appointmentId, 
                          'in-progress'
                        )}
                      >
                        <FaTools />
                        Bắt đầu thực hiện
                      </button>
                    )}
                    {['in-progress', 'in_progress', 'inprogress'].includes(normalizeStatus(selectedMaintenance.status)) && (
                      <button 
                        className="action-btn complete"
                        onClick={() => handleStatusChange(
                          selectedMaintenance.id || selectedMaintenance.appointmentId, 
                          'completed'
                        )}
                      >
                        <FaCheckCircle />
                        Hoàn thành
                      </button>
                    )}
                    {['completed', 'done'].includes(normalizeStatus(selectedMaintenance.status)) && (
                      <div style={{ 
                        padding: '15px', 
                        background: '#d1fae5', 
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <FaCheckCircle style={{ color: '#10b981', fontSize: '24px' }} />
                        <p style={{ margin: '10px 0 0 0', color: '#065f46', fontWeight: '500' }}>
                          ✅ Công việc đã hoàn thành
                        </p>
                      </div>
                    )}
                    <button className="action-btn edit">
                      <FaEdit />
                      Cập nhật tình trạng xe
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FaTools size={60} />
                <p>Chọn một phiếu dịch vụ để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;
