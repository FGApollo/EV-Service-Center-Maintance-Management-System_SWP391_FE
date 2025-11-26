import React, { useState, useEffect } from 'react';
import './AppointmentManagement.css';
import { 
  FaClock, FaCheckCircle, FaTools, FaCheck, FaTimes, 
  FaCalendarAlt, FaUser, FaCar, FaPhone, FaEnvelope,
  FaSpinner, FaSearch, FaUserPlus, FaHandHolding
} from 'react-icons/fa';
import { 
  getAllAppointments, 
  getAppointmentsByStatus,
  acceptAppointment, 
  cancelAppointment,
  startAppointmentProgress,
  completeAppointmentDone,
  getAppointmentStatus,
  handoverAppointment,
  setAppointmentInProgress
} from '../../../../api';
import AssignTechnicianModal from './AssignTechnicianModal';
import StaffSuggestedParts from '../../../../components/staff/StaffSuggestedParts';
import InvoiceModal from '../../../../components/invoice/InvoiceModal';
import InvoiceStatusSection from '../../../../components/invoice/InvoiceStatusSection';
import { showSuccess, showError, showWarning } from '../../../../utils/toast';

function AppointmentManagement() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [allAppointmentsData, setAllAppointmentsData] = useState([]); // Store all data for counting
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest (ID lớn) hoặc oldest (ID bé)
  const [selectedDate, setSelectedDate] = useState(''); // Filter theo ngày đặt lịch
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetail, setAppointmentDetail] = useState(null); // Chi tiết appointment với thông tin kỹ thuật viên
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Định nghĩa các tab trạng thái
  const statusTabs = [
    { 
      key: 'all', 
      label: 'Tất cả', 
      icon: <FaCalendarAlt />, 
      color: '#3b82f6',
      apiStatus: null
    },
    { 
      key: 'pending', 
      label: 'Chờ xác nhận', 
      icon: <FaClock />, 
      color: '#f6ad55',
      apiStatus: 'pending'
    },
    { 
      key: 'accepted', 
      label: 'Đã xác nhận', 
      icon: <FaCheckCircle />, 
      color: '#4299e1',
      apiStatus: 'accepted'
    },
    { 
      key: 'in_progress', 
      label: 'Đang thực hiện', 
      icon: <FaTools />, 
      color: '#9f7aea',
      apiStatus: 'in_progress'
    },
    { 
      key: 'waiting', 
      label: 'Chờ nhận xe', 
      icon: <FaClock />, 
      color: '#48bb78',
      apiStatus: 'awaiting_pickup'
    },
    { 
      key: 'completed', 
      label: 'Đã hoàn thành', 
      icon: <FaCheck />, 
      color: '#48bb78',
      apiStatus: 'completed'
    },
    { 
      key: 'cancelled', 
      label: 'Đã hủy', 
      icon: <FaTimes />, 
      color: '#f56565',
      apiStatus: 'cancelled'
    },
  ];

  // Load data khi component mount
  useEffect(() => {
    fetchAppointments();
  }, [activeStatus]);

  // Fetch chi tiết appointment khi chọn appointment (để lấy thông tin kỹ thuật viên và hóa đơn)
  useEffect(() => {
    if (selectedAppointment && ['accepted', 'in_progress', 'completed', 'waiting'].includes(selectedAppointment.status)) {
      fetchAppointmentDetail(selectedAppointment.id);
    } else {
      setAppointmentDetail(null);
    }
  }, [selectedAppointment]);

  const fetchAppointmentDetail = async (appointmentId) => {
    try {
      setDetailLoading(true);
      console.log('🔍 Đang tải chi tiết appointment #', appointmentId);
      
      const data = await getAppointmentStatus(appointmentId);
      console.log('📦 Chi tiết appointment:', data);
      
      setAppointmentDetail(data);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết appointment:', err);
      // Không hiển thị error cho user vì đây là tính năng bổ sung
      setAppointmentDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Đang tải danh sách lịch hẹn...');
      
      // Lấy centerId của staff từ localStorage
      let staffCenterId = null;
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          staffCenterId = userData.centerId || userData.center_id;
          console.log('🏢 Staff Center ID:', staffCenterId);
        }
      } catch (e) {
        console.error('❌ Lỗi khi đọc thông tin user:', e);
      }
      
      // Gọi API thực tế - luôn cần lấy tất cả appointments để tính count
      // Nếu là waiting thì dùng API riêng cho filtered data, nhưng vẫn cần tất cả để tính count
      let data;
      let allDataForCount = [];
      
      // Luôn lấy tất cả appointments để tính count
      try {
        const allAppointments = await getAllAppointments();
        console.log('📦 [Staff] Tất cả appointments từ API:', allAppointments);
        
        // Map tất cả appointments để tính count
        allDataForCount = (allAppointments || []).map(item => {
          const mappedId = item.appointmentId || item.id || item.appointment_id;
          let mappedStatus = (item.status || '').toLowerCase();
          if (mappedStatus === 'awaiting_pickup') {
            mappedStatus = 'waiting';
          }
          
          return {
            id: mappedId,
            customerId: item.customerId,
            customerName: item.fullName || item.customerName,
            phone: item.phone,
            email: item.email,
            vehicleId: item.vehicleId || item.vehicle?.id,
            vehicleModel: item.vehicleName || item.vehicleModel || item.vehicle?.model,
            vehicleVin: item.vehicleVin || item.vehicle?.vin,
            licensePlate: item.vehicleLicensePlate || item.vehicle?.licensePlate,
            appointmentDate: item.appoimentDate || item.appointmentDate,
            status: mappedStatus,
            services: item.serviceType ? item.serviceType.split(',').map(s => s.trim()) : (item.serviceNames || []),
            cost: item.cost || item.total || 0,
            createAt: item.createAt,
            centerId: item.centerId,
            notes: item.note || ''
          };
        });
        
        // Filter theo centerId của staff
        if (staffCenterId !== null && staffCenterId !== undefined) {
          allDataForCount = allDataForCount.filter(apt => apt.centerId === staffCenterId);
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy tất cả appointments:', err);
      }
      
      // Lấy thêm waiting appointments nếu chưa có trong allDataForCount
      try {
        const waitingData = await getAppointmentsByStatus('awaiting_pickup');
        const waitingMapped = (waitingData || []).map(item => {
          let mappedStatus = (item.status || '').toLowerCase();
          if (mappedStatus === 'awaiting_pickup') {
            mappedStatus = 'waiting';
          }
          return {
            id: item.appointmentId || item.id,
            customerId: item.customerId,
            customerName: item.customerName || item.fullName,
            phone: item.phone,
            email: item.email,
            vehicleId: item.vehicleId || item.vehicle?.id,
            vehicleModel: item.vehicleModel || item.vehicleName || item.vehicle?.model,
            vehicleVin: item.vehicleVin || item.vehicle?.vin,
            licensePlate: item.vehicleLicensePlate || item.vehicle?.licensePlate,
            appointmentDate: item.appointmentDate || item.appoimentDate,
            status: mappedStatus,
            services: item.serviceNames || (item.serviceType ? item.serviceType.split(',').map(s => s.trim()) : []),
            cost: item.total || item.cost || 0,
            createAt: item.createAt,
            centerId: item.centerId,
            notes: item.note || '',
            checkList: item.checkList || [],
            description: item.description || '',
            remarks: item.remarks || '',
            vehicleCondition: item.vehicleCondition || '',
            partUsage: item.partUsage || [],
            users: item.users || []
          };
        });
        
        // Loại bỏ duplicate và merge vào allDataForCount
        const existingIds = new Set(allDataForCount.map(apt => apt.id));
        const uniqueWaitingMapped = waitingMapped.filter(apt => !existingIds.has(apt.id));
        
        // Filter theo centerId của staff
        if (staffCenterId !== null && staffCenterId !== undefined) {
          const filteredWaiting = uniqueWaitingMapped.filter(apt => apt.centerId === staffCenterId);
          allDataForCount = [...allDataForCount, ...filteredWaiting];
        } else {
          allDataForCount = [...allDataForCount, ...uniqueWaitingMapped];
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy waiting appointments:', err);
      }
      
      // Lấy data để hiển thị (filtered)
      if (activeStatus === 'waiting') {
        console.log('📤 [Staff] Fetching appointments with status: awaiting_pickup');
        data = await getAppointmentsByStatus('awaiting_pickup');
      } else {
        data = await getAllAppointments();
      }
      console.log('📦 Dữ liệu từ API (filtered):', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array');
        setAppointments([]);
        return;
      }
      
      // Debug: Xem item đầu tiên để biết API trả về field gì
      if (data.length > 0) {
        console.log('🔍 Sample appointment data:', data[0]);
        console.log('🔍 Available fields:', Object.keys(data[0]));
      }
      
      // Map data từ API sang format component
      let mappedData = data.map(item => {
        const mappedId = item.appointmentId || item.id || item.appointment_id;
        
        if (!mappedId) {
          console.warn('⚠️ Appointment without ID found:', item);
        }
        
        // Map status: awaiting_pickup -> waiting
        let mappedStatus = (item.status || '').toLowerCase();
        if (mappedStatus === 'awaiting_pickup') {
          mappedStatus = 'waiting';
        }
        
        // Lấy centerId từ nhiều nguồn có thể
        // API response có thể có centerId trực tiếp hoặc trong serviceCenter object
        let centerId = item.centerId || 
                      item.serviceCenterId ||
                      (item.serviceCenter && typeof item.serviceCenter === 'object' ? item.serviceCenter.id : null) ||
                      (item.serviceCenter && typeof item.serviceCenter === 'object' ? item.serviceCenter.centerId : null);
        
        // Nếu vẫn không có centerId, thử lấy từ serviceCenterName (có thể cần lookup)
        // Hoặc có thể API không trả về centerId cho waiting appointments
        if (!centerId && activeStatus === 'waiting') {
          console.warn(`⚠️ [Staff] Waiting appointment ${mappedId} không có centerId:`, {
            item: item,
            serviceCenter: item.serviceCenter,
            serviceCenterName: item.serviceCenterName
          });
        }
        
        // Debug log cho waiting appointments
        if (activeStatus === 'waiting') {
          console.log(`🔍 [Staff] Waiting appointment ${mappedId}:`, {
            centerId: centerId,
            staffCenterId: staffCenterId,
            status: mappedStatus,
            itemCenterId: item.centerId,
            serviceCenterId: item.serviceCenterId,
            serviceCenter: item.serviceCenter,
            serviceCenterName: item.serviceCenterName
          });
        }
        
        return {
          id: mappedId,
          customerId: item.customerId,
          customerName: item.customerName || item.fullName,
          phone: item.phone,
          email: item.email,
          vehicleId: item.vehicleId || item.vehicle?.id,
          vehicleModel: item.vehicleModel || item.vehicleName || item.vehicle?.model,
          vehicleVin: item.vehicleVin || item.vehicle?.vin,
          licensePlate: item.vehicleLicensePlate || item.vehicle?.licensePlate,
          appointmentDate: item.appointmentDate || item.appoimentDate, // Note: API có typo "appoimentDate"
          status: mappedStatus,
          services: item.serviceNames || (item.serviceType ? item.serviceType.split(',').map(s => s.trim()) : []),
          cost: item.total || item.cost || 0,
          createAt: item.createAt,
          centerId: centerId, // Sử dụng centerId đã map
          notes: item.note || '',
          checkList: item.checkList || [],
          description: item.description || '',
          remarks: item.remarks || '',
          vehicleCondition: item.vehicleCondition || '',
          partUsage: item.partUsage || [],
          users: item.users || []
        };
      });
      
      // ✅ FILTER theo centerId của staff
      // Lưu ý: Đối với waiting appointments, có thể API không trả về centerId
      // Nếu tất cả waiting appointments không có centerId, có thể cần hiển thị tất cả
      if (staffCenterId !== null && staffCenterId !== undefined) {
        const beforeFilter = mappedData.length;
        const appointmentsWithoutCenterId = mappedData.filter(apt => apt.centerId === null || apt.centerId === undefined);
        
        if (appointmentsWithoutCenterId.length > 0 && activeStatus === 'waiting') {
          console.warn(`⚠️ [Staff] Có ${appointmentsWithoutCenterId.length} waiting appointments không có centerId. Có thể API không trả về centerId cho waiting appointments.`);
          console.warn(`⚠️ [Staff] Sample appointment without centerId:`, appointmentsWithoutCenterId[0]);
        }
        
        mappedData = mappedData.filter(apt => {
          const aptCenterId = apt.centerId;
          
          // Nếu appointment không có centerId và đang ở tab waiting, có thể hiển thị tất cả
          // (vì API có thể không trả về centerId cho waiting appointments)
          if ((aptCenterId === null || aptCenterId === undefined) && activeStatus === 'waiting') {
            console.warn(`⚠️ [Staff] Waiting appointment ${apt.id} không có centerId, nhưng vẫn hiển thị (có thể API không trả về)`);
            return true; // Hiển thị nếu là waiting và không có centerId
          }
          
          // Nếu không phải waiting và không có centerId, loại bỏ
          if (aptCenterId === null || aptCenterId === undefined) {
            return false;
          }
          
          const matches = aptCenterId === staffCenterId;
          if (!matches && activeStatus === 'waiting') {
            console.log(`⚠️ [Staff] Waiting appointment ${apt.id} có centerId ${aptCenterId} không khớp với staff centerId ${staffCenterId}`);
          }
          return matches;
        });
        console.log(`✅ Đã lọc theo chi nhánh ${staffCenterId}: ${beforeFilter} → ${mappedData.length} lịch hẹn`);
      } else {
        console.warn('⚠️ Không tìm thấy centerId của staff, hiển thị tất cả lịch hẹn');
      }
      
      // Debug: Log mappedData sau khi filter
      console.log(`📊 [Staff] Mapped data sau khi filter:`, mappedData);
      console.log(`📊 [Staff] Số lượng appointments:`, mappedData.length);
      if (mappedData.length > 0) {
        console.log(`📊 [Staff] Sample appointment status:`, mappedData[0].status);
      }
      
      // allDataForCount đã được tính ở trên, chỉ cần set vào state
      setAllAppointmentsData(allDataForCount);
      
      // Filter theo status nếu không phải "all"
      const filteredData = activeStatus === 'all' 
        ? mappedData 
        : activeStatus === 'waiting'
          ? mappedData // Đã filter từ API, tất cả đều là awaiting_pickup
          : mappedData.filter(apt => apt.status === activeStatus);
      
      console.log(`✅ Đã tải ${mappedData.length} lịch hẹn, hiển thị ${filteredData.length}`);
      setAppointments(filteredData);
      setSelectedAppointment(null);
      
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách lịch hẹn:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Chấp nhận lịch hẹn
  const handleAcceptAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('✅ Đang chấp nhận lịch hẹn #', appointmentId);
      
      await acceptAppointment(appointmentId);
      
      console.log('✅ Đã chấp nhận lịch hẹn thành công');
      showSuccess('Đã chấp nhận lịch hẹn thành công!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi chấp nhận lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể chấp nhận lịch hẹn');
    } finally{
      setActionLoading(false);
    }
  };

  // Handler: Từ chối/Hủy lịch hẹn
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('❌ Đang hủy lịch hẹn #', appointmentId);
      
      await cancelAppointment(appointmentId);
      
      console.log('✅ Đã hủy lịch hẹn thành công');
      showSuccess('Đã hủy lịch hẹn thành công!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hủy lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể hủy lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Bắt đầu thực hiện lịch hẹn
  const handleStartAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('🔧 Đang bắt đầu thực hiện lịch hẹn #', appointmentId);
      
      await startAppointmentProgress(appointmentId);
      
      console.log('✅ Đã bắt đầu thực hiện lịch hẹn');
      showSuccess('Đã bắt đầu thực hiện lịch hẹn!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi bắt đầu lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể bắt đầu lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Hoàn thành lịch hẹn
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      console.log('✔️ Đang hoàn thành lịch hẹn #', appointmentId);
      
      await completeAppointmentDone(appointmentId);
      
      console.log('✅ Đã hoàn thành lịch hẹn');
      showSuccess('Đã hoàn thành lịch hẹn!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi hoàn thành lịch hẹn:', err);
      showError(err.response?.data?.message || 'Không thể hoàn thành lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Bàn giao và hoàn thành appointment
  const handleHandoverAppointment = async (appointmentId) => {
    if (!window.confirm('Xác nhận bàn giao và hoàn thành đơn này?\n\nĐơn sẽ được đánh dấu là đã hoàn thành và bàn giao cho khách hàng.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('📤 Đang bàn giao appointment #', appointmentId);
      
      await handoverAppointment(appointmentId);
      
      console.log('✅ Đã bàn giao appointment thành công');
      showSuccess('Đã bàn giao và hoàn thành đơn thành công!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi bàn giao appointment:', err);
      showError(err.response?.data?.message || 'Không thể bàn giao đơn');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Chuyển lại trạng thái đơn về in_progress
  const handleSetInProgress = async (appointmentId) => {
    if (!window.confirm('Xác nhận chuyển đơn này về trạng thái "Đang thực hiện"?\n\nĐơn sẽ được chuyển lại để technician tiếp tục xử lý.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('🔧 Đang chuyển appointment về in_progress #', appointmentId);
      
      // Tìm appointment hiện tại để kiểm tra status
      const currentAppointment = appointments.find(apt => apt.id === appointmentId);
      const currentStatus = currentAppointment?.status;
      
      console.log('📊 Current appointment status:', currentStatus);
      
      // Nếu đang ở awaiting_pickup (waiting), có thể cần chuyển qua accepted trước
      // Thử chuyển qua accepted trước, sau đó mới sang in_progress
      if (currentStatus === 'waiting' || currentStatus === 'awaiting_pickup') {
        console.log('⚠️ Appointment đang ở trạng thái waiting, thử chuyển qua accepted trước');
        try {
          await acceptAppointment(appointmentId);
          console.log('✅ Đã chuyển sang accepted, tiếp tục chuyển sang in_progress');
        } catch (acceptErr) {
          console.warn('⚠️ Không thể chuyển sang accepted, thử chuyển trực tiếp sang in_progress:', acceptErr);
        }
      }
      
      await setAppointmentInProgress(appointmentId);
      
      console.log('✅ Đã chuyển appointment về in_progress thành công');
      showSuccess('Đã chuyển đơn về trạng thái "Đang thực hiện"!');
      
      // Reload data
      await fetchAppointments();
      
    } catch (err) {
      console.error('❌ Lỗi khi chuyển trạng thái:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Không thể chuyển trạng thái đơn';
      console.error('❌ Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: errorMessage
      });
      showError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Giao việc cho technician
  const handleAssignTechnicians = async (technicianIds) => {
    console.log('✅ Đã giao việc cho technicians:', technicianIds);
    // Reload data sau khi giao việc
    await fetchAppointments();
  };

  // Helper function để so sánh ngày (chỉ so sánh ngày, không so sánh giờ)
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Lọc appointments theo search query và ngày đặt lịch
  let filteredAppointments = appointments.filter((apt) => {
    // Filter theo search query
    const matchesSearch = searchQuery === '' || 
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      apt.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter theo ngày đặt lịch
    const matchesDate = selectedDate === '' || 
      (apt.appointmentDate && isSameDate(apt.appointmentDate, selectedDate));
    
    return matchesSearch && matchesDate;
  });

  // Sắp xếp theo ID
  filteredAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id - a.id; // ID lớn trước
    } else {
      return a.id - b.id; // ID bé trước
    }
  });

  // Get current tab info
  const currentTab = statusTabs.find(tab => tab.key === activeStatus);
  
  // Helper function để lấy thông tin status
  const getStatusInfo = (status) => {
    return statusTabs.find(tab => tab.key === status) || statusTabs[0];
  };

  return (
    <div className="appointment-management">
      {/* Header */}
      <div className="appointment-header">
        <h2>Quản lý lịch hẹn</h2>
        
        <div className="header-actions">
          {/* Date Filter */}
          <div className="date-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCalendarAlt style={{ color: '#667eea' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                style={{
                  padding: '8px 12px',
                  background: '#f56565',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Xóa filter ngày"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <label>Sắp xếp:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">ID mới nhất</option>
              <option value="oldest">ID cũ nhất</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số điện thoại, biển số xe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {statusTabs.map((tab) => {
          const count = tab.key === 'all' 
            ? allAppointmentsData.length 
            : allAppointmentsData.filter(apt => apt.status === tab.key).length;
          
          return (
            <button
              key={tab.key}
              className={`status-tab ${activeStatus === tab.key ? 'active' : ''}`}
              onClick={() => setActiveStatus(tab.key)}
              style={{
                '--tab-color': tab.color
              }}
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
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchAppointments}>Thử lại</button>
        </div>
      )}

      {/* Content */}
      <div className="appointment-content">
        {/* Appointments List */}
        <div className="appointments-list">
          <div className="list-header">
            <h3>
              Danh sách ({filteredAppointments.length})
            </h3>
          </div>

          <div className="appointments-items">
            {loading ? (
              <div className="loading-state">
                <FaSpinner className="spinner" />
                <p>Đang tải danh sách...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <FaClock size={50} />
                <p>Không có lịch hẹn nào</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const appointmentStatus = activeStatus === 'all' 
                  ? getStatusInfo(appointment.status) 
                  : currentTab;
                
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-item ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                    onClick={() => {
                      console.log('🖱️ Selected appointment:', appointment);
                      console.log('📋 Appointment ID:', appointment.id);
                      setSelectedAppointment(appointment);
                    }}
                  >
                    <div className="appointment-item-header">
                      <div className="appointment-icon" style={{ background: appointmentStatus.color }}>
                        {appointmentStatus.icon}
                      </div>
                      <div className="appointment-basic-info">
                        <div className="appointment-name-id">
                          <h4>{appointment.customerName}</h4>
                          <span className="appointment-id">#{appointment.id}</span>
                        </div>
                      </div>
                      {activeStatus === 'all' && (
                        <span 
                          className="appointment-status-badge" 
                          style={{ background: appointmentStatus.color }}
                        >
                          {appointmentStatus.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="appointment-item-body">
                      <div className="info-row">
                        <FaCar />
                        <span>{appointment.vehicleModel} - {appointment.licensePlate}</span>
                      </div>
                      <div className="info-row">
                        <FaCalendarAlt />
                        <span>{new Date(appointment.appointmentDate).toLocaleString('vi-VN')}</span>
                      </div>
                      <div className="info-row">
                        <FaPhone />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Appointment Detail */}
        <div className="appointment-detail">
          {selectedAppointment ? (
            (() => {
              const detailStatus = activeStatus === 'all' 
                ? getStatusInfo(selectedAppointment.status) 
                : currentTab;
              
              return (
                <>
                  <div className="detail-header">
                    <div className="detail-icon-large" style={{ background: detailStatus.color }}>
                      {detailStatus.icon}
                    </div>
                    <div>
                      <h2>Chi tiết lịch hẹn #{selectedAppointment.id}</h2>
                      <span 
                        className="status-badge" 
                        style={{ background: detailStatus.color }}
                      >
                        {detailStatus.label}
                      </span>
                    </div>
                  </div>

              <div className="detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaUser />
                    <div>
                      <span className="label">Tên khách hàng</span>
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
                    <FaEnvelope />
                    <div>
                      <span className="label">Email</span>
                      <span className="value">{selectedAppointment.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin xe</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaCar />
                    <div>
                      <span className="label">Model</span>
                      <span className="value">{selectedAppointment.vehicleModel}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCar />
                    <div>
                      <span className="label">Biển số xe</span>
                      <span className="value">{selectedAppointment.licensePlate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin dịch vụ</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span className="label">Thời gian hẹn</span>
                      <span className="value">
                        {new Date(selectedAppointment.appointmentDate).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  {selectedAppointment.cost > 0 && (
                    <div className="detail-item">
                      <FaCheck />
                      <div>
                        <span className="label">Chi phí</span>
                        <span className="value highlight">
                          {selectedAppointment.cost.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="services-list">
                  <h4>Dịch vụ yêu cầu:</h4>
                  <ul>
                    {selectedAppointment.services.length > 0 ? (
                      selectedAppointment.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))
                    ) : (
                      <li style={{ borderBottom: 'none', color: '#a0aec0' }}>Chưa có dịch vụ nào</li>
                    )}
                  </ul>
                </div>

                {selectedAppointment.notes && (
                  <div className="notes-section">
                    <h4>Ghi chú:</h4>
                    <p>{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Thông tin kỹ thuật viên - chỉ hiển thị cho accepted, in_progress, completed (KHÔNG hiển thị cho waiting) */}
              {['accepted', 'in_progress', 'completed'].includes(selectedAppointment.status) && (
                <div className="detail-section">
                  <h3>Kỹ thuật viên được giao</h3>
                  {detailLoading ? (
                    <div className="technicians-loading">
                      <FaSpinner className="spinner" />
                      <p>Đang tải thông tin kỹ thuật viên...</p>
                    </div>
                  ) : appointmentDetail && appointmentDetail.users && appointmentDetail.users.length > 0 ? (
                    <div className="technicians-list">
                      {appointmentDetail.users.map((tech, index) => (
                        <div key={tech.id || index} className="technician-card">
                          <div className="technician-avatar">
                            <FaUser />
                          </div>
                          <div className="technician-info">
                            <h4>{tech.fullName}</h4>
                            <div className="tech-detail-row">
                              <FaPhone />
                              <span>{tech.phone || 'Chưa có số điện thoại'}</span>
                            </div>
                            {tech.email && (
                              <div className="tech-detail-row">
                                <FaEnvelope />
                                <span>{tech.email}</span>
                              </div>
                            )}
                            {tech.role && (
                              <div className="tech-role-badge">
                                {tech.role}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-technicians">
                      <FaUserPlus size={40} />
                      <p>Chưa có kỹ thuật viên được giao</p>
                    </div>
                  )}
                </div>
              )}

              {/* Nút hiển thị hóa đơn - chỉ hiển thị cho waiting */}
              {selectedAppointment.status === 'waiting' && (
                <div className="detail-section">
                  <h3>Hóa đơn</h3>
                  <button 
                    className="btn-view-invoice"
                    onClick={() => setShowInvoiceModal(true)}
                  >
                    <FaCheckCircle />
                    Xem hóa đơn
                  </button>
                </div>
              )}
              
              {/* Invoice Modal */}
              {showInvoiceModal && (
                <InvoiceModal
                  isOpen={showInvoiceModal}
                  onClose={() => setShowInvoiceModal(false)}
                  appointmentId={selectedAppointment.id}
                  appointmentDetail={appointmentDetail}
                />
              )}

              {/* Trạng thái hóa đơn - chỉ hiển thị cho waiting */}
              {selectedAppointment.status === 'waiting' && appointmentDetail && appointmentDetail.invoices && (
                <div className="detail-section">
                  <InvoiceStatusSection 
                    invoices={appointmentDetail.invoices || []}
                    appointmentId={selectedAppointment.id}
                  />
                </div>
              )}

              {/* Linh kiện đề xuất thay thế - hiển thị cho tất cả appointments */}
              <div className="detail-section">
                <StaffSuggestedParts 
                  appointmentId={selectedAppointment.id}
                  showOnlyProcessed={selectedAppointment.status === 'waiting'}
                />
              </div>

              {activeStatus !== 'all' && (
                <div className="detail-actions">
                  {activeStatus === 'pending' && (
                    <>
                      <button 
                        className="btn-accept"
                        onClick={() => handleAcceptAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaCheckCircle />}
                        {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaTimes />}
                        {actionLoading ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                    </>
                  )}
                  {activeStatus === 'accepted' && (
                    <>
                      <button 
                        className="btn-assign"
                        onClick={() => {
                          if (!selectedAppointment?.id) {
                            showError('Không tìm thấy ID lịch hẹn. Vui lòng chọn lại lịch hẹn.');
                            return;
                          }
                          console.log('🔍 Opening modal for appointment ID:', selectedAppointment.id);
                          setShowAssignModal(true);
                        }}
                        disabled={actionLoading}
                      >
                        <FaUserPlus />
                        Giao việc cho Technician
                      </button>
                    </>
                  )}
                  {activeStatus === 'in_progress' && (
                    <>
                      {/* Không có nút action cho phần đang thực hiện */}
                    </>
                  )}
                  {activeStatus === 'waiting' && (
                    <>
                      <button 
                        className="btn-handover"
                        onClick={() => handleHandoverAppointment(selectedAppointment.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <FaSpinner className="spinner" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FaHandHolding />
                            Bàn giao và hoàn thành
                          </>
                        )}
                      </button>
                      <button 
                        className="btn-back-to-progress"
                        onClick={() => handleSetInProgress(selectedAppointment.id)}
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
                            Chuyển lại trạng thái đơn
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
                </>
              );
            })()
          ) : (
            <div className="empty-detail">
              <FaClock size={60} />
              <p>Chọn một lịch hẹn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Technician Modal */}
      <AssignTechnicianModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        appointmentId={selectedAppointment?.id}
        onAssign={handleAssignTechnicians}
        existingTechnicians={appointmentDetail?.users || []}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        appointmentId={selectedAppointment?.id}
        appointmentDetail={appointmentDetail}
      />
    </div>
  );
}

export default AppointmentManagement;
