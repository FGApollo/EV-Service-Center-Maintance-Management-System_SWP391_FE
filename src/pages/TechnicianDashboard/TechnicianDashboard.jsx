import React, { useState, useEffect } from 'react';
import './TechnicianDashboard.css';
import { 
  FaClock, FaCheckCircle, FaTools, FaCheck, 
  FaCalendarAlt, FaUser, FaCar, FaPhone,
  FaSpinner, FaSearch, FaClipboardList, FaPlus, FaTimesCircle
} from 'react-icons/fa';
import { 
  getAppointmentsForStaff,
  startAppointment, 
  completeAppointment,
  createMaintenanceRecord,
  markAppointmentAsDone
} from '../../api';

function TechnicianDashboard() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [allAppointmentsData, setAllAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [vehicleCondition, setVehicleCondition] = useState({
    exterior: '',
    interior: '',
    battery: '',
    tires: ''
  });
  
  // Maintenance Record State
  const [maintenanceRecord, setMaintenanceRecord] = useState({
    vehicleCondition: '',
    checklist: '',
    remarks: '',
    partsUsed: [],
    staffIds: []
  });
  
  // Part being added
  const [newPart, setNewPart] = useState({
    partId: '',
    quantityUsed: '',
    unitCost: ''
  });

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
      
      // Debug: Kiểm tra user info
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log('👤 [Technician] User data:', userData);
          console.log('👤 [Technician] User ID:', userData.user_id || userData.id || userData.userId);
          console.log('👤 [Technician] Role:', userData.role);
        } catch (e) {
          console.error('❌ Lỗi parse user data:', e);
        }
      } else {
        console.error('❌ Không tìm thấy user trong localStorage');
      }
      
      const data = await getAppointmentsForStaff();
      console.log('📦 [Technician] Dữ liệu từ API:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        setAllAppointmentsData([]);
        return;
      }
      
      // Debug: Xem item đầu tiên
      if (data.length > 0) {
        console.log('🔍 Sample appointment:', data[0]);
        console.log('🔍 Available fields:', Object.keys(data[0]));
      }
      
      // Map data từ API mới
      const mappedData = data.map(item => ({
        id: item.appointmentId,
        customerId: item.customerId,
        customerName: item.customerName,
        phone: item.phone,
        email: item.email,
        vehicleId: item.vehicle?.id,
        vehicleModel: item.vehicleModel,
        vehicleVin: item.vehicle?.vin,
        licensePlate: item.vehicle?.licensePlate,
        appointmentDate: item.appointmentDate,
        status: (item.status || '').toLowerCase(),
        services: item.serviceNames || [],
        cost: item.total || 0,
        notes: item.note || '',
        checkList: item.checkList || [],
        serviceCenterName: item.serviceCenterName,
        assignedTechs: item.users || []
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
      
      let errorMsg = 'Không thể tải danh sách phiếu dịch vụ';
      
      // Nếu là error từ validation user ID
      if (err.message && !err.response) {
        errorMsg = err.message;
      } else if (err.response?.status === 500) {
        errorMsg = 'Lỗi server (500). Vui lòng liên hệ admin.';
      } else if (err.response?.status === 401) {
        errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.response?.status === 403) {
        errorMsg = 'Bạn không có quyền truy cập.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Không tìm thấy thông tin technician này.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(errorMsg);
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
    if (!window.confirm('Xác nhận hoàn thành công việc này?\n\n⚠️ Lưu ý: Hãy đảm bảo bạn đã lưu thông tin bảo dưỡng (bấm nút "Lưu thông tin bảo dưỡng") trước khi hoàn thành.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('✔️ [Technician] Hoàn thành appointment #', appointmentId);
      
      // Gọi API PUT /api/appointments/{id}/done với data rỗng
      await markAppointmentAsDone(appointmentId);
      
      console.log('✅ Appointment completed (done)');
      alert('✅ Công việc đã hoàn thành!');
      
      // Refresh list
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hoàn thành:', err);
      console.error('❌ Error response:', err.response?.data);
      alert(err.response?.data?.message || 'Không thể hoàn thành công việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCondition = async () => {
    try {
      // Validate required fields
      if (!maintenanceRecord.vehicleCondition.trim()) {
        alert('⚠️ Vui lòng nhập tình trạng xe');
        return;
      }
      
      if (!maintenanceRecord.checklist.trim()) {
        alert('⚠️ Vui lòng nhập checklist');
        return;
      }
      
      // Get current technician ID from localStorage
      let staffIds = [];
      
      // Cách 1: Lấy từ assigned technicians nếu có
      if (selectedAppointment.assignedTechs && selectedAppointment.assignedTechs.length > 0) {
        staffIds = selectedAppointment.assignedTechs.map(tech => tech.id);
        console.log('📋 Using assigned techs:', staffIds);
      } else {
        // Cách 2: Lấy ID technician đang đăng nhập
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            const userId = userData.user_id || userData.id || userData.userId;
            if (userId) {
              staffIds = [userId];
              console.log('👤 Using current technician ID:', userId);
            }
          } catch (e) {
            console.error('❌ Lỗi parse user data:', e);
          }
        }
      }
      
      if (staffIds.length === 0) {
        alert('⚠️ Không tìm thấy thông tin technician. Vui lòng đăng nhập lại.');
        return;
      }
      
      const recordData = {
        vehicleCondition: maintenanceRecord.vehicleCondition,
        checklist: maintenanceRecord.checklist,
        remarks: maintenanceRecord.remarks || '',
        partsUsed: maintenanceRecord.partsUsed.map(part => ({
          partId: parseInt(part.partId),
          quantityUsed: parseInt(part.quantityUsed),
          unitCost: parseFloat(part.unitCost)
        })),
        staffIds: staffIds
      };
      
      console.log('💾 Saving maintenance record:', recordData);
      console.log('👥 Staff IDs:', staffIds);
      
      setActionLoading(true);
      const response = await createMaintenanceRecord(selectedAppointment.id, recordData);
      
      console.log('✅ Maintenance record saved:', response);
      alert('✅ Đã lưu thông tin bảo dưỡng thành công!');
      setIsEditingCondition(false);
      
    } catch (err) {
      console.error('❌ Lỗi khi lưu maintenance record:', err);
      console.error('❌ Error response:', err.response?.data);
      alert(err.response?.data?.message || 'Không thể lưu thông tin bảo dưỡng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEditCondition = () => {
    setIsEditingCondition(false);
    // Reset về giá trị ban đầu
    setMaintenanceRecord({
      vehicleCondition: '',
      checklist: '',
      remarks: '',
      partsUsed: [],
      staffIds: []
    });
    setNewPart({
      partId: '',
      quantityUsed: '',
      unitCost: ''
    });
  };
  
  const handleAddPart = () => {
    if (!newPart.partId || !newPart.quantityUsed || !newPart.unitCost) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin linh kiện');
      return;
    }
    
    setMaintenanceRecord({
      ...maintenanceRecord,
      partsUsed: [...maintenanceRecord.partsUsed, { ...newPart }]
    });
    
    // Reset form
    setNewPart({
      partId: '',
      quantityUsed: '',
      unitCost: ''
    });
  };
  
  const handleRemovePart = (index) => {
    setMaintenanceRecord({
      ...maintenanceRecord,
      partsUsed: maintenanceRecord.partsUsed.filter((_, i) => i !== index)
    });
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

              {/* Dịch vụ yêu cầu */}
              {selectedAppointment.services && selectedAppointment.services.length > 0 && (
                <div className="detail-section">
                  <h3>Dịch vụ yêu cầu</h3>
                  <div className="services-list-tech">
                    {selectedAppointment.services.map((service, index) => (
                      <div key={index} className="service-item-tech">
                        <FaTools style={{ color: '#667eea' }} />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Thông tin bảo dưỡng */}
              {isEditingCondition && (
                <div className="detail-section maintenance-form">
                  <h3>📝 Thông tin bảo dưỡng</h3>
                  
                  {/* Vehicle Condition */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="required">*</span> Tình trạng xe:
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Mô tả chi tiết tình trạng xe (ngoại thất, nội thất, pin, lốp...)"
                      rows="4"
                      value={maintenanceRecord.vehicleCondition}
                      onChange={(e) => setMaintenanceRecord({
                        ...maintenanceRecord,
                        vehicleCondition: e.target.value
                      })}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="required">*</span> Checklist thực hiện:
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Danh sách các công việc đã thực hiện (mỗi mục 1 dòng)"
                      rows="4"
                      value={maintenanceRecord.checklist}
                      onChange={(e) => setMaintenanceRecord({
                        ...maintenanceRecord,
                        checklist: e.target.value
                      })}
                    />
                  </div>

                  {/* Remarks */}
                  <div className="form-group">
                    <label className="form-label">Ghi chú thêm:</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Ghi chú hoặc lưu ý đặc biệt..."
                      rows="3"
                      value={maintenanceRecord.remarks}
                      onChange={(e) => setMaintenanceRecord({
                        ...maintenanceRecord,
                        remarks: e.target.value
                      })}
                    />
                  </div>

                  {/* Parts Used */}
                  <div className="form-group parts-section">
                    <label className="form-label">Linh kiện đã sử dụng:</label>
                    
                    {/* List of added parts */}
                    {maintenanceRecord.partsUsed.length > 0 && (
                      <div className="parts-list">
                        {maintenanceRecord.partsUsed.map((part, index) => (
                          <div key={index} className="part-item">
                            <div className="part-info">
                              <span className="part-id">ID: {part.partId}</span>
                              <span className="part-qty">SL: {part.quantityUsed}</span>
                              <span className="part-cost">{parseFloat(part.unitCost).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <button 
                              className="btn-remove-part"
                              onClick={() => handleRemovePart(index)}
                              type="button"
                            >
                              <FaTimesCircle />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new part form */}
                    <div className="add-part-form">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ID Linh kiện"
                        value={newPart.partId}
                        onChange={(e) => setNewPart({...newPart, partId: e.target.value})}
                      />
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Số lượng"
                        value={newPart.quantityUsed}
                        onChange={(e) => setNewPart({...newPart, quantityUsed: e.target.value})}
                      />
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Đơn giá (VNĐ)"
                        value={newPart.unitCost}
                        onChange={(e) => setNewPart({...newPart, unitCost: e.target.value})}
                      />
                      <button 
                        className="btn-add-part"
                        onClick={handleAddPart}
                        type="button"
                      >
                        <FaPlus /> Thêm
                      </button>
                    </div>
                  </div>

                  {/* Staff Info (Read-only) */}
                  {selectedAppointment.assignedTechs && selectedAppointment.assignedTechs.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Kỹ thuật viên thực hiện:</label>
                      <div className="staff-chips">
                        {selectedAppointment.assignedTechs.map((tech) => (
                          <span key={tech.id} className="staff-chip">
                            {tech.fullName} (ID: {tech.id})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save/Cancel Buttons */}
                  <div className="condition-edit-actions">
                    <button 
                      className="btn-save-condition"
                      onClick={handleSaveCondition}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="spinner" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Lưu thông tin bảo dưỡng
                        </>
                      )}
                    </button>
                    <button 
                      className="btn-cancel-condition"
                      onClick={handleCancelEditCondition}
                      disabled={actionLoading}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              {selectedAppointment.notes && (
                <div className="detail-section">
                  <h3>Ghi chú:</h3>
                  <div className="notes-box">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Tổng chi phí */}
              {selectedAppointment.cost > 0 && (
                <div className="detail-section">
                  <div className="cost-box">
                    <span className="cost-label">Tổng chi phí:</span>
                    <span className="cost-value">{selectedAppointment.cost.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              )}

              {/* Nút Cập nhật tình trạng xe */}
              {selectedAppointment.status === 'in_progress' && !isEditingCondition && (
                <div className="detail-section">
                  <button 
                    className="btn-update-status"
                    onClick={() => setIsEditingCondition(true)}
                  >
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
                        Bắt đầu làm việc
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
                        Hoàn thành công việc
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

