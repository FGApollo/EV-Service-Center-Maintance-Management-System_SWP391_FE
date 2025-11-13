import React, { useState, useEffect } from 'react';
import './TechnicianDashboard.css';
import { 
  FaClock, FaCheckCircle, FaTools, FaCheck, 
  FaCalendarAlt, FaUser, FaCar, FaPhone,
  FaSpinner, FaSearch, FaClipboardList
} from 'react-icons/fa';
import { getAppointmentsForStaff, startAppointment, completeAppointment } from '../../api';

function TechnicianDashboard() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [allAppointmentsData, setAllAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Định nghĩa các trạng thái
  const statusTabs = [
    { 
      key: 'all', 
      label: 'Tất cả', 
      icon: <FaClipboardList />, 
      color: '#667eea',
      apiStatus: null
    },
    { 
      key: 'accepted', 
      label: 'Đã xác nhận', 
      icon: <FaCheckCircle />, 
      color: '#f6ad55',
      apiStatus: 'accepted'
    },
    { 
      key: 'in_progress', 
      label: 'Đang làm', 
      icon: <FaTools />, 
      color: '#9f7aea',
      apiStatus: 'in_progress'
    },
    { 
      key: 'completed', 
      label: 'Hoàn tất', 
      icon: <FaCheck />, 
      color: '#48bb78',
      apiStatus: 'completed'
    },
  ];

  useEffect(() => {
    fetchAppointments();
  }, [activeStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Technician] Đang tải danh sách phiếu dịch vụ...');
      
      const data = await getAppointmentsForStaff(activeStatus === 'all' ? null : activeStatus);
      console.log('📦 [Technician] Dữ liệu từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        setAllAppointmentsData([]);
        return;
      }
      
      // Map data (giả sử API trả về format tương tự Staff)
      const mappedData = data.map(item => ({
        id: item.appointmentId || item.id,
        customerId: item.customerId,
        customerName: item.fullName || item.customerName,
        phone: item.phone,
        email: item.email,
        vehicleId: item.vehicleId,
        vehicleModel: item.vehicleName || item.vehicleModel,
        licensePlate: item.vehicleLicensePlate || item.licensePlate,
        appointmentDate: item.appoimentDate || item.appointmentDate,
        status: (item.status || '').toLowerCase(),
        services: item.serviceType ? item.serviceType.split(',').map(s => s.trim()) : [],
        cost: item.cost || 0,
        notes: item.note || '',
        checkList: item.checkList || []
      }));
      
      setAllAppointmentsData(mappedData);
      
      const filteredData = activeStatus === 'all' 
        ? mappedData 
        : mappedData.filter(apt => apt.status === activeStatus);
      
      console.log(`✅ Đã tải ${mappedData.length} phiếu, hiển thị ${filteredData.length}`);
      setAppointments(filteredData);
      setSelectedAppointment(null);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách phiếu dịch vụ');
      setAppointments([]);
      setAllAppointmentsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('🔧 [Technician] Bắt đầu làm phiếu #', appointmentId);
      
      await startAppointment(appointmentId);
      
      console.log('✅ Đã bắt đầu làm việc');
      alert('✅ Đã bắt đầu làm việc!');
      
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi bắt đầu:', err);
      alert(err.response?.data?.message || 'Không thể bắt đầu làm việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteWork = async (appointmentId) => {
    if (!window.confirm('Xác nhận hoàn thành công việc này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('✔️ [Technician] Hoàn thành phiếu #', appointmentId);
      
      await completeAppointment(appointmentId);
      
      console.log('✅ Đã hoàn thành');
      alert('✅ Công việc đã hoàn thành!');
      
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hoàn thành:', err);
      alert(err.response?.data?.message || 'Không thể hoàn thành công việc');
    } finally {
      setActionLoading(false);
    }
  };

  // Lọc theo search
  const filteredAppointments = appointments.filter((apt) =>
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.phone.includes(searchQuery) ||
    apt.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(apt.id).includes(searchQuery)
  );

  const currentTab = statusTabs.find(tab => tab.key === activeStatus);
  
  const getStatusInfo = (status) => {
    return statusTabs.find(tab => tab.key === status) || statusTabs[0];
  };

  return (
    <div className="technician-dashboard">
      {/* Header */}
      <div className="tech-header">
        <h1>Quy trình Bảo dưỡng - Kỹ Thuật Viên</h1>
        
        {/* Search Box */}
        <div className="tech-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="tech-stats-cards">
        {statusTabs.slice(1).map((tab) => {
          const count = allAppointmentsData.filter(apt => apt.status === tab.key).length;
          return (
            <div 
              key={tab.key} 
              className="tech-stat-card"
              style={{ borderLeftColor: tab.color }}
            >
              <div className="stat-icon" style={{ background: tab.color }}>
                {tab.icon}
              </div>
              <div className="stat-content">
                <h3>{count}</h3>
                <p>{tab.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Tabs */}
      <div className="tech-status-tabs">
        {statusTabs.map((tab) => {
          const count = tab.key === 'all' 
            ? allAppointmentsData.length 
            : allAppointmentsData.filter(apt => apt.status === tab.key).length;
          
          return (
            <button
              key={tab.key}
              className={`tech-status-tab ${activeStatus === tab.key ? 'active' : ''}`}
              onClick={() => setActiveStatus(tab.key)}
              style={{ '--tab-color': tab.color }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="tech-error-message">
          <p>❌ {error}</p>
          <button onClick={fetchAppointments}>Thử lại</button>
        </div>
      )}

      {/* Main Content */}
      <div className="tech-content">
        {/* Left: Appointments List */}
        <div className="tech-appointments-list">
          <div className="list-header">
            <h3>Danh sách phiếu dịch vụ ({filteredAppointments.length})</h3>
          </div>

          <div className="appointments-items">
            {loading ? (
              <div className="tech-loading-state">
                <FaSpinner className="spinner" />
                <p>Đang tải...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="tech-empty-state">
                <FaClipboardList size={50} />
                <p>Không có phiếu dịch vụ nào</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const appointmentStatus = activeStatus === 'all' 
                  ? getStatusInfo(appointment.status) 
                  : currentTab;
                
                return (
                  <div
                    key={appointment.id}
                    className={`tech-appointment-item ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                    onClick={() => {
                      console.log('🖱️ Selected:', appointment);
                      setSelectedAppointment(appointment);
                    }}
                  >
                    <div className="appointment-item-header">
                      <div className="appointment-number">
                        #{appointment.id}
                      </div>
                      <span 
                        className="appointment-status-badge" 
                        style={{ background: appointmentStatus.color }}
                      >
                        {appointmentStatus.label}
                      </span>
                    </div>
                    
                    <div className="appointment-item-body">
                      <h4>{appointment.customerName}</h4>
                      <div className="info-row">
                        <FaCar />
                        <span>{appointment.vehicleModel}</span>
                      </div>
                      <div className="info-row">
                        <span className="license-plate">{appointment.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Appointment Detail */}
        <div className="tech-appointment-detail">
          {selectedAppointment ? (
            <>
              <div className="detail-header">
                <h2>Phiếu dịch vụ #{selectedAppointment.id}</h2>
                <span 
                  className="detail-status-badge" 
                  style={{ 
                    background: getStatusInfo(selectedAppointment.status).color 
                  }}
                >
                  {getStatusInfo(selectedAppointment.status).label.toUpperCase()}
                </span>
              </div>

              {/* Thông tin chung */}
              <div className="detail-section">
                <h3>Thông tin chung</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaUser />
                    <div>
                      <span className="label">Khách hàng</span>
                      <span className="value">{selectedAppointment.customerName}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaPhone />
                    <div>
                      <span className="label">Số điện thoại</span>
                      <span className="value">{selectedAppointment.phone}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCar />
                    <div>
                      <span className="label">Xe</span>
                      <span className="value">{selectedAppointment.vehicleModel}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span className="label">Ngày hẹn</span>
                      <span className="value">
                        {selectedAppointment.appointmentDate ? 
                          new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN') 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIN Number */}
              {selectedAppointment.vehicleVin && (
                <div className="detail-section">
                  <h3>VIN Number</h3>
                  <div className="vin-box">
                    {selectedAppointment.vehicleVin}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {selectedAppointment.checkList && selectedAppointment.checkList.length > 0 && (
                <div className="detail-section">
                  <h3>Checklist EV - Gói bảo dưỡng Cơ bản</h3>
                  <div className="checklist-items">
                    {selectedAppointment.checkList.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <FaCheckCircle style={{ color: '#48bb78' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tình trạng xe */}
              <div className="detail-section">
                <h3>Tình trạng xe</h3>
                <div className="vehicle-condition">
                  <div className="condition-row">
                    <span className="condition-label">Ngoại thất:</span>
                    <span className="condition-status">Đang kiểm tra</span>
                  </div>
                  <div className="condition-row">
                    <span className="condition-label">Nội thất:</span>
                    <span className="condition-status">Đang kiểm tra</span>
                  </div>
                  <div className="condition-row">
                    <span className="condition-label">Pin:</span>
                    <span className="condition-status">Đang kiểm tra</span>
                  </div>
                  <div className="condition-row">
                    <span className="condition-label">Lốp xe:</span>
                    <span className="condition-status">Đang kiểm tra</span>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedAppointment.notes && (
                <div className="detail-section">
                  <h3>Ghi chú:</h3>
                  <div className="notes-box">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Cập nhật tình trạng xe */}
              {selectedAppointment.status === 'in_progress' && (
                <div className="detail-section">
                  <h3>Cập nhật tình trạng xe</h3>
                  <button className="btn-update-status">
                    <FaClipboardList />
                    Cập nhật tình trạng xe
                  </button>
                </div>
              )}

              {/* Action Buttons - BÊN TRÁI */}
              <div className="detail-actions-left">
                {selectedAppointment.status === 'accepted' && (
                  <button 
                    className="btn-start-work"
                    onClick={() => handleStartWork(selectedAppointment.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaTools />
                        Công việc đã hoàn thành
                      </>
                    )}
                  </button>
                )}
                {selectedAppointment.status === 'in_progress' && (
                  <button 
                    className="btn-complete-work"
                    onClick={() => handleCompleteWork(selectedAppointment.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Công việc đã hoàn thành
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="tech-empty-detail">
              <FaClipboardList size={60} />
              <p>Chọn một phiếu dịch vụ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnicianDashboard;

