import React, { useState, useEffect } from 'react';
import './StaffDashboard.css';
import { FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, FaEdit, FaUserCog } from 'react-icons/fa';
import { getCustomersByRole, getAppointmentsForStaff, getAppointmentById, acceptAppointment, cancelAppointment, startAppointment, completeAppointment, getVehicleById, getTechnicians, assignTechnician, createAppointment } from '../api';

function StaffDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('customers'); // customers, cars, chat, appointments, maintenance, parts
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChatCustomer, setActiveChatCustomer] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [partsSearchQuery, setPartsSearchQuery] = useState('');

  // Dữ liệu khách hàng từ API
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dữ liệu technicians
  const [technicians, setTechnicians] = useState([]);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState([]); // Array để chọn nhiều technicians
  const [assigningAppointmentId, setAssigningAppointmentId] = useState(null);

  // Modal thêm lịch hẹn mới
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    customerId: '',
    vehicleId: '',
    serviceTypes: [],
    appointmentDate: '',
    notes: '',
    // Thông tin khách hàng mới
    customerFullName: '',
    customerEmail: '',
    customerPhone: ''
  });

  // Lấy thông tin center_id của staff từ localStorage
  const [staffCenterId, setStaffCenterId] = useState(null);

  // Fetch danh sách khách hàng khi component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCustomersByRole();
        console.log('📋 Danh sách khách hàng:', data);
        setCustomers(data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách khách hàng:', err);
        setError(err.response?.data?.message || 'Không thể tải danh sách khách hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Lấy thông tin user và set staffCenterId
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        const centerId = userData.center_id || userData.centerId;
        setStaffCenterId(centerId);
        console.log('🏢 Staff Center ID:', centerId);
        console.log('📋 Full user data:', userData);
      }
    } catch (error) {
      console.error('Lỗi khi đọc thông tin user:', error);
    }
  }, []);

  // Fetch danh sách technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await getTechnicians();
        console.log('👷 Danh sách technicians từ API:', data);
        console.log('📊 Số lượng technicians:', Array.isArray(data) ? data.length : 'Không phải array');
        console.log('👤 Staff Center ID:', staffCenterId);
        
        if (Array.isArray(data)) {
          // Log trạng thái working của từng technician
          data.forEach(tech => {
            console.log(`  👷 ${tech.fullName || tech.name || `Tech #${tech.id}`}: ${tech.working ? '🔴 Đang bận' : '🟢 Rảnh'}`);
          });
        }
        
        // 🚧 TẠM THỜI: Hiển thị TẤT CẢ technicians (không lọc theo center_id)
        setTechnicians(Array.isArray(data) ? data : []);
        
        // // Lọc theo center_id nếu cần (TẠM THỜI COMMENT OUT)
        // let filteredTechnicians = data;
        // if (staffCenterId !== null && staffCenterId !== undefined) {
        //   filteredTechnicians = data.filter(tech => {
        //     const techCenterId = tech.center_id || tech.centerId;
        //     console.log(`  🔍 Tech #${tech.id}: centerId=${techCenterId}, Match=${techCenterId === staffCenterId}`);
        //     return techCenterId === staffCenterId;
        //   });
        //   console.log(`  ✅ Sau khi lọc: ${filteredTechnicians.length} technicians`);
        // }
        // setTechnicians(filteredTechnicians);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách technicians:', err);
        console.error('📝 Chi tiết lỗi:', err.response?.data || err.message);
      }
    };

    // 🚧 TẠM THỜI: Luôn fetch (không cần check staffCenterId)
    fetchTechnicians();
  }, [staffCenterId]);

  // Dữ liệu chat mẫu
  const [chatCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Cảm ơn bạn!', time: '10:30', unread: 2 },
    { id: 2, name: 'Trần Thị B', lastMessage: 'Xe của tôi đã sẵn sàng chưa?', time: '09:15', unread: 0 },
    { id: 3, name: 'Lê Văn C', lastMessage: 'Tôi muốn đặt lịch', time: 'Hôm qua', unread: 1 },
  ]);

  // Dữ liệu lịch hẹn từ API
  const [allAppointments, setAllAppointments] = useState([]); // Tất cả lịch hẹn
  const [appointments, setAppointments] = useState([]); // Lịch hẹn sau khi filter
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); // Filter theo status
  const [vehiclesCache, setVehiclesCache] = useState({}); // Cache thông tin xe

  // Fetch appointments khi component mount hoặc khi tab appointments được chọn
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab, staffCenterId]);

  // Filter appointments theo selectedStatus
  useEffect(() => {
    if (selectedStatus) {
      let filtered;
      
      // Handle các status variations từ backend
      if (selectedStatus === 'in_progress' || selectedStatus === 'in-progress' || selectedStatus === 'inProgress') {
        // Filter cho "Đang thực hiện" - accept tất cả variations
        filtered = allAppointments.filter(apt => 
          ['in-progress', 'in_progress', 'inProgress'].includes(apt.status)
        );
        console.log(`🔍 Lọc "Đang thực hiện": từ ${allAppointments.length} → ${filtered.length}`);
      } else if (selectedStatus === 'completed' || selectedStatus === 'done') {
        // Filter cho "Hoàn thành" - accept cả completed và done
        filtered = allAppointments.filter(apt => 
          ['completed', 'done'].includes(apt.status)
        );
        console.log(`🔍 Lọc "Hoàn thành": từ ${allAppointments.length} → ${filtered.length}`);
      } else {
        // Các status khác: exact match
        filtered = allAppointments.filter(apt => apt.status === selectedStatus);
        console.log(`🔍 Lọc theo status="${selectedStatus}": từ ${allAppointments.length} → ${filtered.length}`);
      }
      
      setAppointments(filtered);
    } else {
      console.log('✅ Hiển thị tất cả:', allAppointments.length);
      setAppointments(allAppointments);
    }
  }, [selectedStatus, allAppointments]);

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      
      // 🔐 VALIDATION: Kiểm tra staffCenterId trước khi fetch
      console.log('🔄 Đang fetch lịch hẹn...');
      console.log('🏢 Staff Center ID:', staffCenterId);
      
      // ⚠️ WARNING: Nếu không có center_id, có thể là vấn đề permissions
      if (staffCenterId === null || staffCenterId === undefined) {
        console.warn('⚠️ ⚠️ ⚠️ KHÔNG TÌM THẤY CENTER_ID!');
        console.warn('   → Staff có thể thấy TẤT CẢ appointments từ mọi center!');
        console.warn('   → Kiểm tra user data trong localStorage có center_id không?');
        
        // Thử lấy lại từ localStorage
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            console.log('   📋 User data keys:', Object.keys(userData));
            console.log('   📋 User data:', userData);
            
            const retryCenterId = userData.center_id || userData.centerId || userData.serviceCenterId || userData.service_center_id;
            if (retryCenterId) {
              console.log('   ✅ Tìm thấy center_id trong user data:', retryCenterId);
              setStaffCenterId(retryCenterId);
            }
          }
        } catch (e) {
          console.error('   ❌ Lỗi khi parse user data:', e);
        }
      }
      
      // Luôn fetch TẤT CẢ lịch hẹn (backend có thể đã filter theo token)
      const data = await getAppointmentsForStaff(null);
      console.log('📦 Dữ liệu từ API:', data);
      console.log('📦 Số lượng appointments từ API:', Array.isArray(data) ? data.length : 'Không phải array');
      
      // Đảm bảo data là array
      if (!Array.isArray(data)) {
        console.error('❌ Data không phải array:', data);
        setAllAppointments([]);
        setAppointments([]);
        return [];
      }
      
      // Log sample appointment để kiểm tra cấu trúc
      if (data.length > 0) {
        console.log('🔬 Sample appointment structure:', data[0]);
        console.log('🔬 Sample keys:', Object.keys(data[0]));
        console.log('🔬 Sample center fields:', {
          serviceCenterId: data[0].serviceCenterId,
          service_center_id: data[0].service_center_id,
          centerId: data[0].centerId,
          center_id: data[0].center_id
        });
      }
      
      // 🔐 Lọc lịch hẹn theo center_id của staff (QUAN TRỌNG: Bảo mật)
      let filteredData = data;
      const currentCenterId = staffCenterId;
      
      if (currentCenterId !== null && currentCenterId !== undefined) {
        // ✅ CÓ center_id → Filter theo center
        const beforeCount = data.length;
        filteredData = data.filter(appointment => {
          // Kiểm tra cả camelCase và snake_case
          const aptCenterId = appointment.serviceCenterId || 
                             appointment.service_center_id || 
                             appointment.centerId || 
                             appointment.center_id ||
                             appointment.serviceCenter?.id ||
                             appointment.service_center?.id;
          
          const appointmentId = appointment.id || appointment.appointmentId;
          
          // Convert về cùng type để so sánh (string vs number)
          const aptCenterIdNormalized = aptCenterId != null ? String(aptCenterId) : null;
          const staffCenterIdNormalized = String(currentCenterId);
          
          const isMatch = aptCenterIdNormalized === staffCenterIdNormalized;
          
          // Log chi tiết cho debugging (chỉ log nếu ít appointments)
          if (data.length <= 10) {
            console.log(`🔍 Appointment #${appointmentId}:`, {
              aptCenterId,
              staffCenterId: currentCenterId,
              match: isMatch ? '✅' : '❌',
              normalized: {
                apt: aptCenterIdNormalized,
                staff: staffCenterIdNormalized
              }
            });
          }
          
          return isMatch;
        });
        
        const afterCount = filteredData.length;
        console.log('✅ Đã lọc lịch hẹn theo center_id:', currentCenterId);
        console.log('📊 Kết quả:', {
          'Tổng từ API': beforeCount,
          'Sau khi filter': afterCount,
          'Đã loại bỏ': beforeCount - afterCount
        });
        
        // ⚠️ WARNING: Nếu filter ra 0 appointments nhưng API trả về nhiều
        if (beforeCount > 0 && afterCount === 0) {
          console.warn('⚠️ ⚠️ ⚠️ FILTER RA 0 APPOINTMENTS!');
          console.warn('   → Có thể field name không đúng');
          console.warn('   → Hoặc appointments không có center_id');
          console.warn('   → Sample appointment:', data[0]);
        }
      } else {
        // ⚠️ KHÔNG CÓ center_id → Hiển thị tất cả (CẢNH BÁO BẢO MẬT)
        console.warn('⚠️ ⚠️ ⚠️ KHÔNG CÓ CENTER_ID - HIỂN THỊ TẤT CẢ APPOINTMENTS!');
        console.warn('   → Đây có thể là vấn đề bảo mật!');
        console.warn('   → Staff có thể thấy appointments từ mọi center!');
        console.warn('   → Tổng số appointments:', data.length);
        
        // Log để kiểm tra xem có appointments từ nhiều center không
        if (data.length > 0) {
          const centerIds = new Set();
          data.forEach(apt => {
            const centerId = apt.serviceCenterId || apt.service_center_id || apt.centerId || apt.center_id;
            if (centerId) centerIds.add(centerId);
          });
          console.warn('   → Số lượng center khác nhau:', centerIds.size);
          console.warn('   → Center IDs:', Array.from(centerIds));
        }
      }
      
      // Lưu tất cả appointments vào state
      setAllAppointments(filteredData);
      
      // Fetch thông tin xe cho các appointments
      const vehicleIds = [...new Set(filteredData.map(apt => apt.vehicleId).filter(Boolean))];
      fetchVehicleInfo(vehicleIds);
      
      // appointments sẽ được set bởi useEffect filter theo selectedStatus
      // Return filtered data để có thể sử dụng ngay sau khi gọi
      return filteredData;
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách lịch hẹn:', err);
      console.error('❌ Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      setAppointmentsError(err.response?.data?.message || 'Không thể tải danh sách lịch hẹn');
      setAllAppointments([]);
      setAppointments([]);
      return [];
    } finally {
      setAppointmentsLoading(false);
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

  // Handler để filter theo status
  const handleStatusFilter = (status) => {
    console.log('🔍 Lọc theo status:', status);
    setSelectedStatus(status === selectedStatus ? null : status); // Toggle: click lại để bỏ filter
  };

  // Dữ liệu quy trình bảo dưỡng
  const [maintenanceList, setMaintenanceList] = useState([
    {
      id: 1,
      ticketNumber: 'TK-001',
      customerName: 'Nguyễn Văn A',
      carInfo: 'Tesla Model 3 - 29A-12345',
      vin: 'WBA3B5C50DF123456',
      service: 'Bảo dưỡng định kỳ',
      status: 'waiting', // waiting, in-progress, completed
      startTime: '2025-10-17 09:00',
      estimatedTime: '2 giờ',
      technician: 'Phạm Văn D',
      checklist: [
        { item: 'Kiểm tra pin', status: 'completed' },
        { item: 'Kiểm tra phanh', status: 'completed' },
        { item: 'Kiểm tra lốp xe', status: 'in-progress' },
        { item: 'Kiểm tra hệ thống điện', status: 'pending' },
        { item: 'Vệ sinh nội thất', status: 'pending' }
      ],
      carCondition: {
        exterior: 'Tốt - Không có vết xước',
        interior: 'Sạch sẽ',
        battery: '95% - Tình trạng tốt',
        tire: 'Lốp trước: 70%, Lốp sau: 75%',
        notes: 'Xe trong tình trạng tốt, không có vấn đề nghiêm trọng'
      }
    },
    {
      id: 2,
      ticketNumber: 'TK-002',
      customerName: 'Trần Thị B',
      carInfo: 'VinFast VF e34 - 30B-67890',
      vin: 'VF8A1B2C3D4E56789',
      service: 'Thay lốp xe',
      status: 'in-progress',
      startTime: '2025-10-17 10:00',
      estimatedTime: '1 giờ',
      technician: 'Nguyễn Văn E',
      checklist: [
        { item: 'Tháo lốp cũ', status: 'completed' },
        { item: 'Kiểm tra mâm xe', status: 'completed' },
        { item: 'Lắp lốp mới', status: 'in-progress' },
        { item: 'Cân bằng lốp', status: 'pending' },
        { item: 'Kiểm tra áp suất', status: 'pending' }
      ],
      carCondition: {
        exterior: 'Bình thường',
        interior: 'Sạch sẽ',
        battery: '88% - Tình trạng tốt',
        tire: 'Đang thay mới',
        notes: 'Lốp cũ đã mòn 85%'
      }
    },
    {
      id: 3,
      ticketNumber: 'TK-003',
      customerName: 'Lê Văn C',
      carInfo: 'BMW i4 - 51C-11111',
      vin: 'BMW5C50DF789012',
      service: 'Kiểm tra hệ thống điện',
      status: 'completed',
      startTime: '2025-10-16 14:00',
      completedTime: '2025-10-16 16:30',
      estimatedTime: '2.5 giờ',
      technician: 'Trần Văn G',
      checklist: [
        { item: 'Kiểm tra bộ sạc', status: 'completed' },
        { item: 'Kiểm tra hệ thống dây điện', status: 'completed' },
        { item: 'Kiểm tra màn hình điều khiển', status: 'completed' },
        { item: 'Cập nhật phần mềm', status: 'completed' },
        { item: 'Test drive', status: 'completed' }
      ],
      carCondition: {
        exterior: 'Tốt',
        interior: 'Tốt',
        battery: '92% - Tình trạng tốt',
        tire: 'Tốt - 80%',
        notes: 'Đã sửa lỗi hệ thống sạc, xe hoạt động bình thường'
      }
    }
  ]);

  // Dữ liệu phụ tùng (view-only)
  const [partsList] = useState([
    {
      id: 'PT-001',
      name: 'Pin Lithium-ion 75kWh',
      category: 'Pin & Điện',
      brand: 'Tesla',
      model: 'Model 3, Model Y',
      partNumber: 'TES-BAT-75K',
      stock: 5,
      minStock: 2,
      price: 250000000,
      supplier: {
        name: 'Tesla Vietnam',
        contact: '028-1234-5678',
        email: 'parts@tesla.vn'
      },
      location: 'Kho A - Kệ 1',
      lastUpdated: '2025-10-15',
      status: 'in-stock', // in-stock, low-stock, out-of-stock
      description: 'Pin Lithium-ion cao cấp cho Tesla Model 3/Y, bảo hành 8 năm',
      specifications: {
        'Dung lượng': '75 kWh',
        'Điện áp': '350V',
        'Trọng lượng': '480 kg',
        'Bảo hành': '8 năm hoặc 192,000 km'
      }
    },
    {
      id: 'PT-002',
      name: 'Động cơ điện 200kW',
      category: 'Động cơ',
      brand: 'VinFast',
      model: 'VF e34, VF 8',
      partNumber: 'VF-MOT-200K',
      stock: 3,
      minStock: 1,
      price: 180000000,
      supplier: {
        name: 'VinFast Parts',
        contact: '1900-23-23-89',
        email: 'parts@vinfast.vn'
      },
      location: 'Kho B - Kệ 3',
      lastUpdated: '2025-10-12',
      status: 'in-stock',
      description: 'Động cơ điện công suất cao cho VinFast VF e34 và VF 8',
      specifications: {
        'Công suất': '200 kW (268 HP)',
        'Mô-men xoắn': '400 Nm',
        'Trọng lượng': '85 kg',
        'Bảo hành': '5 năm hoặc 150,000 km'
      }
    },
    {
      id: 'PT-003',
      name: 'Phanh đĩa thông gió trước',
      category: 'Phanh',
      brand: 'Brembo',
      model: 'Universal EV',
      partNumber: 'BRE-DSK-F380',
      stock: 1,
      minStock: 3,
      price: 8500000,
      supplier: {
        name: 'Auto Parts Co.',
        contact: '028-9876-5432',
        email: 'sales@autoparts.vn'
      },
      location: 'Kho C - Kệ 2',
      lastUpdated: '2025-10-17',
      status: 'low-stock',
      description: 'Phanh đĩa thông gió cao cấp Brembo cho xe điện',
      specifications: {
        'Đường kính': '380 mm',
        'Độ dày': '34 mm',
        'Chất liệu': 'Gang đúc',
        'Bảo hành': '2 năm hoặc 50,000 km'
      }
    },
    {
      id: 'PT-004',
      name: 'Lốp xe điện Michelin',
      category: 'Lốp & Mâm',
      brand: 'Michelin',
      model: 'Universal',
      partNumber: 'MCH-TIR-235',
      stock: 24,
      minStock: 12,
      price: 3200000,
      supplier: {
        name: 'Michelin Vietnam',
        contact: '1800-1234',
        email: 'contact@michelin.vn'
      },
      location: 'Kho D - Tầng 1',
      lastUpdated: '2025-10-16',
      status: 'in-stock',
      description: 'Lốp xe chuyên dụng cho xe điện, giảm ma sát, tăng quãng đường',
      specifications: {
        'Kích thước': '235/45R18',
        'Chỉ số tải': '98',
        'Xếp hạng tốc độ': 'W (270 km/h)',
        'Bảo hành': '3 năm hoặc 80,000 km'
      }
    },
    {
      id: 'PT-005',
      name: 'Bộ sạc nhanh DC 150kW',
      category: 'Pin & Điện',
      brand: 'ABB',
      model: 'Universal',
      partNumber: 'ABB-CHG-150',
      stock: 0,
      minStock: 1,
      price: 120000000,
      supplier: {
        name: 'ABB Vietnam',
        contact: '028-3930-5555',
        email: 'info@abb.vn'
      },
      location: 'Kho A - Kệ 5',
      lastUpdated: '2025-10-10',
      status: 'out-of-stock',
      description: 'Bộ sạc nhanh DC công suất cao 150kW',
      specifications: {
        'Công suất': '150 kW',
        'Điện áp': '200-920 VDC',
        'Dòng điện': '500A tối đa',
        'Bảo hành': '3 năm'
      }
    },
    {
      id: 'PT-006',
      name: 'Màn hình cảm ứng 15.4"',
      category: 'Điện tử',
      brand: 'Samsung',
      model: 'Tesla Model 3',
      partNumber: 'SAM-SCR-154',
      stock: 4,
      minStock: 2,
      price: 25000000,
      supplier: {
        name: 'Samsung Display',
        contact: '1800-588-889',
        email: 'display@samsung.vn'
      },
      location: 'Kho E - Kệ 1',
      lastUpdated: '2025-10-14',
      status: 'in-stock',
      description: 'Màn hình cảm ứng trung tâm cho Tesla Model 3',
      specifications: {
        'Kích thước': '15.4 inch',
        'Độ phân giải': '1920x1200',
        'Loại': 'LCD Touchscreen',
        'Bảo hành': '2 năm'
      }
    },
    {
      id: 'PT-007',
      name: 'Bộ điều khiển BMS',
      category: 'Pin & Điện',
      brand: 'Bosch',
      model: 'Universal EV',
      partNumber: 'BSH-BMS-500',
      stock: 8,
      minStock: 3,
      price: 15000000,
      supplier: {
        name: 'Bosch Auto Parts',
        contact: '028-3812-1234',
        email: 'parts@bosch.vn'
      },
      location: 'Kho A - Kệ 2',
      lastUpdated: '2025-10-13',
      status: 'in-stock',
      description: 'Battery Management System điều khiển pin thông minh',
      specifications: {
        'Điện áp': '12-800V',
        'Số kênh': '96 cells',
        'Giao tiếp': 'CAN Bus',
        'Bảo hành': '3 năm'
      }
    },
    {
      id: 'PT-008',
      name: 'Dây cáp sạc Type 2',
      category: 'Phụ kiện',
      brand: 'Phoenix Contact',
      model: 'Universal',
      partNumber: 'PHX-CBL-T2',
      stock: 15,
      minStock: 10,
      price: 4500000,
      supplier: {
        name: 'EV Accessories Co.',
        contact: '028-7777-8888',
        email: 'sales@evaccessories.vn'
      },
      location: 'Kho F - Kệ 3',
      lastUpdated: '2025-10-16',
      status: 'in-stock',
      description: 'Dây cáp sạc Type 2 chuẩn Châu Âu, 5 mét',
      specifications: {
        'Loại': 'Type 2 (IEC 62196)',
        'Chiều dài': '5 mét',
        'Dòng điện': '32A',
        'Bảo hành': '1 năm'
      }
    }
  ]);

  const filteredCustomers = customers.filter(customer => {
    const name = customer.fullName || customer.name || '';
    const email = customer.email || '';
    const phone = customer.phone || '';
    const query = searchQuery.toLowerCase();
    
    return name.toLowerCase().includes(query) ||
           email.toLowerCase().includes(query) ||
           phone.includes(searchQuery);
  });

  const filteredParts = partsList.filter(part =>
    part.name.toLowerCase().includes(partsSearchQuery.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(partsSearchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(partsSearchQuery.toLowerCase()) ||
    part.brand.toLowerCase().includes(partsSearchQuery.toLowerCase())
  );

  const getStockStatusColor = (status) => {
    switch(status) {
      case 'in-stock': return '#27ae60';
      case 'low-stock': return '#f39c12';
      case 'out-of-stock': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStockStatusText = (status) => {
    switch(status) {
      case 'in-stock': return 'Còn hàng';
      case 'low-stock': return 'Sắp hết';
      case 'out-of-stock': return 'Hết hàng';
      default: return status;
    }
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedCar(null);
  };

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleChatCustomerClick = (customer) => {
    setActiveChatCustomer(customer);
    // Giả lập tin nhắn
    setChatMessages([
      { id: 1, sender: 'customer', text: 'Xin chào, tôi muốn hỏi về dịch vụ bảo dưỡng', time: '09:00' },
      { id: 2, sender: 'staff', text: 'Chào bạn! Chúng tôi có thể giúp gì cho bạn?', time: '09:01' },
      { id: 3, sender: 'customer', text: 'Tôi muốn đặt lịch bảo dưỡng cho xe Tesla Model 3', time: '09:02' },
      { id: 4, sender: 'staff', text: 'Bạn muốn đặt lịch vào thời gian nào ạ?', time: '09:03' },
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeChatCustomer) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'staff',
        text: newMessage,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      console.log('🔄 Updating appointment status:', { 
        appointmentId, 
        newStatus,
        currentStatus: selectedAppointment?.status 
      });
      
      // Gọi API tương ứng với từng action
      let apiResponse;
      switch(newStatus) {
        case 'accepted':
          apiResponse = await acceptAppointment(appointmentId);
          console.log('✅ Accept API response:', apiResponse);
          break;
        case 'cancelled':
          apiResponse = await cancelAppointment(appointmentId);
          console.log('✅ Cancel API response:', apiResponse);
          break;
        case 'in-progress':
        case 'in_progress': {
          console.log('📞 Calling startAppointment API...');
          console.log('   Current appointment:', selectedAppointment);
          console.log('   Current STATUS:', selectedAppointment?.status);
          console.log('   TechIds:', selectedAppointment?.techIds);
          console.log('   AssignedStaffs:', selectedAppointment?.assignedStaffs);
          
          // Check status trước khi gọi API
          if (['in-progress', 'in_progress', 'inProgress'].includes(selectedAppointment?.status)) {
            console.log('⚠️ Appointment đã ở trạng thái in-progress rồi!');
            alert('ℹ️ Đơn hàng đã ở trạng thái "Đang thực hiện"');
            
            // Refresh UI
            await fetchAppointments();
            const currentApt = allAppointments.find(apt => 
              apt.id === appointmentId || apt.appointmentId === appointmentId
            );
            if (currentApt) {
              setSelectedAppointment(currentApt);
            }
            return; // Exit
          }
          
          // ✅ Step 3: Extract staffIds từ appointment data
          let staffIds = [];
          
          // Priority 1: assignedTechnicianIds (từ local state khi giao việc)
          if (selectedAppointment?.assignedTechnicianIds && Array.isArray(selectedAppointment.assignedTechnicianIds)) {
            staffIds = selectedAppointment.assignedTechnicianIds;
            console.log('✅ Using assignedTechnicianIds:', staffIds);
          }
          // Priority 2: assignedStaffs (từ local state sau giao việc)
          else if (selectedAppointment?.assignedStaffs && Array.isArray(selectedAppointment.assignedStaffs)) {
            staffIds = selectedAppointment.assignedStaffs.map(s => s.id || s.staffId).filter(Boolean);
            console.log('✅ Using assignedStaffs IDs:', staffIds);
          }
          // Priority 3: techIds (từ API response)
          else if (selectedAppointment?.techIds) {
            if (typeof selectedAppointment.techIds === 'string') {
              // Nếu là string (được ngăn cách bằng dấu phẩy hoặc khoảng cách)
              staffIds = selectedAppointment.techIds
                .split(/[,\s]+/)
                .filter(id => id.trim())
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
            } else if (Array.isArray(selectedAppointment.techIds)) {
              staffIds = selectedAppointment.techIds;
            }
            console.log('✅ Using techIds:', staffIds);
          }
          // Priority 4: assignedTechs (từ API response có thể có)
          else if (selectedAppointment?.assignedTechs && Array.isArray(selectedAppointment.assignedTechs)) {
            staffIds = selectedAppointment.assignedTechs.map(t => t.id).filter(Boolean);
            console.log('✅ Using assignedTechs IDs:', staffIds);
          }
          
          console.log('👷 Final staffIds to send:', staffIds);
          
          // ⚠️ VALIDATE: Check xem đã giao việc cho technician chưa
          const hasTechIds = staffIds.length > 0;
          const hasAssignmentFlag = selectedAppointment?.hasAssignment === true;
          
          console.log('🔍 Pre-start validation:', {
            staffIdsLength: staffIds.length,
            hasTechIds,
            hasAssignmentFlag,
            canStart: hasTechIds || hasAssignmentFlag
          });
          
          // Nếu chưa giao việc, block action
          if (!hasTechIds && !hasAssignmentFlag) {
            console.log('❌ Validation failed: No technician assigned');
            alert('⚠️ Vui lòng giao việc cho kỹ thuật viên trước khi bắt đầu thực hiện!\n\nHãy bấm nút "Giao việc" để chọn kỹ thuật viên.');
            return; // Block action
          }
          
          try {
            // 👈 GỬI staffIds vào API
            apiResponse = await startAppointment(appointmentId, staffIds);
            console.log('✅ Start API response:', apiResponse);
            console.log('   Status in response:', apiResponse?.status);
            console.log('   TechIds in response:', apiResponse?.techIds);
            
            // ✅ LƯU TÊN TECHNICIAN NGAY SAU KHI START THÀNH CÔNG
            if (apiResponse?.techIds) {
              console.log('💾 Parsing techIds from startAppointment response:', apiResponse.techIds);
              
              // Parse techIds - có thể là string "1,2,3" hoặc array [1,2,3]
              let techIdsArray = [];
              if (typeof apiResponse.techIds === 'string') {
                techIdsArray = apiResponse.techIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
              } else if (Array.isArray(apiResponse.techIds)) {
                techIdsArray = apiResponse.techIds.map(id => parseInt(id));
              }
              
              console.log('   📋 Parsed techIds array:', techIdsArray);
              
              // Map với danh sách technicians để lấy TÊN
              const assignedStaffsFromResponse = techIdsArray.map(techId => {
                const tech = technicians.find(t => t.id === techId || t.userId === techId);
                if (tech) {
                  return {
                    id: tech.id || tech.userId,
                    fullName: tech.fullName || tech.name || `Kỹ thuật viên #${techId}`,
                    email: tech.email || '',
                    phone: tech.phone || '',
                    working: tech.working || false
                  };
                }
                // Fallback nếu không tìm thấy trong technicians list
                return {
                  id: techId,
                  fullName: `Kỹ thuật viên #${techId}`,
                  email: '',
                  phone: '',
                  working: false
                };
              }).filter(s => s.id);
              
              console.log('   ✅ Mapped technician names:', assignedStaffsFromResponse.map(s => ({
                id: s.id,
                fullName: s.fullName
              })));
              
              // ✅ CẬP NHẬT selectedAppointment NGAY LẬP TỨC với tên technician
              if (selectedAppointment && (selectedAppointment.id === appointmentId || selectedAppointment.appointmentId === appointmentId)) {
                const updatedAppointment = {
                  ...selectedAppointment,
                  status: apiResponse.status || 'in_progress',
                  techIds: apiResponse.techIds,
                  assignedStaffs: assignedStaffsFromResponse,
                  assignedTechnicianIds: techIdsArray,
                  assignedTechniciansCount: assignedStaffsFromResponse.length,
                  hasAssignment: assignedStaffsFromResponse.length > 0
                };
                
                console.log('   💾 Updated selectedAppointment with technician names:', {
                  id: updatedAppointment.id,
                  status: updatedAppointment.status,
                  assignedStaffs: updatedAppointment.assignedStaffs.map(s => s.fullName),
                  assignedTechniciansCount: updatedAppointment.assignedTechniciansCount
                });
                
                setSelectedAppointment(updatedAppointment);
              }
            }
          } catch (startError) {
            console.error('❌ Start API error details:', {
              status: startError.response?.status,
              statusText: startError.response?.statusText,
              data: startError.response?.data,
              message: startError.message
            });
            
            // Nếu lỗi 403, có thể đã ở trạng thái in-progress rồi
            if (startError.response?.status === 403) {
              console.log('⚠️ 403 Error - Checking if already in-progress...');
              // Refresh để lấy status mới nhất
              const freshAppointments = await fetchAppointments();
              const currentApt = freshAppointments.find(apt => 
                apt.id === appointmentId || apt.appointmentId === appointmentId
              );
              
              if (currentApt && ['in-progress', 'in_progress', 'inProgress'].includes(currentApt.status)) {
                console.log('✅ Appointment đã ở trạng thái in-progress rồi');
                alert('ℹ️ Đơn hàng đã ở trạng thái "Đang thực hiện"');
                // Update selectedAppointment
                if (selectedAppointment?.id === appointmentId || selectedAppointment?.appointmentId === appointmentId) {
                  setSelectedAppointment(currentApt);
                }
                return; // Exit function, không throw error
              }
            }
            
            throw startError; // Re-throw nếu không phải case trên
          }
          break;
        } // 👈 End of 'in-progress' block
        case 'completed':
        case 'done':
          console.log('📞 Calling completeAppointment API...');
          console.log('   Current appointment status:', selectedAppointment?.status);
          console.log('   Appointment ID:', appointmentId);
          try {
            apiResponse = await completeAppointment(appointmentId);
            console.log('✅ Complete API response:', apiResponse);
          } catch (completeError) {
            console.error('❌ Complete API error details:', {
              status: completeError.response?.status,
              statusText: completeError.response?.statusText,
              data: completeError.response?.data,
              message: completeError.message
            });
            throw completeError;
          }
          break;
        default:
          throw new Error('Trạng thái không hợp lệ');
      }
      
      console.log('✅ Status updated successfully, refreshing appointments...');
      
      // Refresh danh sách appointments sau khi cập nhật
      const freshAppointments = await fetchAppointments();
      
      // Cập nhật selectedAppointment nếu đang xem chi tiết
      if (selectedAppointment?.id === appointmentId || selectedAppointment?.appointmentId === appointmentId) {
        console.log('🔄 Updating selectedAppointment...');
        
        try {
          // Fetch chi tiết appointment từ API để có đầy đủ thông tin (bao gồm cả assignments)
          const detailedAppointment = await getAppointmentById(appointmentId);
          console.log('✅ Detailed appointment fetched:', detailedAppointment);
          console.log('   👥 staffAssignments from API:', detailedAppointment.staffAssignments);
          console.log('   🔍 All keys:', Object.keys(detailedAppointment));
          
          // Parse staffAssignments từ backend nếu có
          let assignedStaffsFromAPI = null;
          
          // Nếu có techIds từ API response (startAppointment), merge vào
          if (apiResponse?.techIds) {
            console.log('   🔄 Merging techIds from status change API:', apiResponse.techIds);
            detailedAppointment.techIds = apiResponse.techIds;
          }
          
          // Check techIds field (backend mới)
          if (detailedAppointment.techIds) {
            console.log('   🆕 Found techIds in status change:', detailedAppointment.techIds);
            
            // Parse techIds - có thể là string "1,2,3" hoặc array [1,2,3]
            let techIdsArray = [];
            if (typeof detailedAppointment.techIds === 'string') {
              techIdsArray = detailedAppointment.techIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            } else if (Array.isArray(detailedAppointment.techIds)) {
              techIdsArray = detailedAppointment.techIds.map(id => parseInt(id));
            }
            
            console.log('   📋 Parsed techIds array:', techIdsArray);
            
            // Map với danh sách technicians
            assignedStaffsFromAPI = techIdsArray.map(techId => {
              const tech = technicians.find(t => t.id === techId || t.userId === techId);
              if (tech) {
                return {
                  id: tech.id || tech.userId,
                  fullName: tech.fullName || tech.name,
                  email: tech.email,
                  phone: tech.phone,
                  working: tech.working
                };
              }
              return {
                id: techId,
                fullName: `Kỹ thuật viên #${techId}`,
                email: '',
                phone: ''
              };
            }).filter(s => s.id);
            
            console.log('   ✅ Mapped staffs from techIds:', assignedStaffsFromAPI);
          }
          // Fallback: Check staffAssignments (cách cũ)
          else if (detailedAppointment.staffAssignments && Array.isArray(detailedAppointment.staffAssignments)) {
            // staffAssignments có thể là array of assignment objects từ database
            // Database structure: { assignment_id, staff_id, appointment_id, role, start_time, end_time, notes }
            assignedStaffsFromAPI = detailedAppointment.staffAssignments.map(assignment => {
              // Case 1: Nested staff object (backend đã join)
              if (assignment.staff) {
                return {
                  id: assignment.staff.id || assignment.staff_id,
                  fullName: assignment.staff.fullName || assignment.staff.full_name,
                  email: assignment.staff.email,
                  phone: assignment.staff.phone,
                  working: assignment.staff.working || false,
                  // Thêm thông tin assignment nếu có
                  assignmentId: assignment.assignment_id || assignment.id,
                  role: assignment.role,
                  startTime: assignment.start_time || assignment.startTime,
                  endTime: assignment.end_time || assignment.endTime,
                  notes: assignment.notes
                };
              }
              // Case 2: Direct staff info (backend đã flatten)
              if (assignment.id || assignment.staff_id) {
                return {
                  id: assignment.id || assignment.staff_id,
                  fullName: assignment.fullName || assignment.full_name,
                  email: assignment.email,
                  phone: assignment.phone,
                  working: assignment.working || false,
                  // Thêm thông tin assignment nếu có
                  assignmentId: assignment.assignment_id || assignment.id,
                  role: assignment.role,
                  startTime: assignment.start_time || assignment.startTime,
                  endTime: assignment.end_time || assignment.endTime,
                  notes: assignment.notes
                };
              }
              // Case 3: Chỉ có staff_id (cần map với technicians list)
              if (assignment.staff_id) {
                const tech = technicians.find(t => t.id === assignment.staff_id || t.userId === assignment.staff_id);
                if (tech) {
                  return {
                    id: tech.id || tech.userId,
                    fullName: tech.fullName || tech.name,
                    email: tech.email,
                    phone: tech.phone,
                    working: tech.working || false,
                    // Thêm thông tin assignment
                    assignmentId: assignment.assignment_id,
                    role: assignment.role || 'technician',
                    startTime: assignment.start_time || assignment.startTime,
                    endTime: assignment.end_time || assignment.endTime,
                    notes: assignment.notes
                  };
                }
                // Fallback nếu không tìm thấy trong technicians list
                return {
                  id: assignment.staff_id,
                  fullName: `Kỹ thuật viên #${assignment.staff_id}`,
                  email: '',
                  phone: '',
                  working: false,
                  assignmentId: assignment.assignment_id,
                  role: assignment.role || 'technician',
                  startTime: assignment.start_time || assignment.startTime,
                  endTime: assignment.end_time || assignment.endTime,
                  notes: assignment.notes
                };
              }
              return null;
            }).filter(s => s && s.id); // Remove invalid entries
            
            console.log('   ✅ Parsed assignedStaffs from staffAssignments:', assignedStaffsFromAPI);
            console.log('   📋 Assignment details:', assignedStaffsFromAPI.map(s => ({
              id: s.id,
              fullName: s.fullName,
              assignmentId: s.assignmentId,
              role: s.role,
              startTime: s.startTime
            })));
          }
          
          // Giữ lại thông tin assignedStaffs: ưu tiên API, fallback local state
          const finalAssignedStaffs = assignedStaffsFromAPI && assignedStaffsFromAPI.length > 0
            ? assignedStaffsFromAPI
            : (detailedAppointment.assignedStaffs || selectedAppointment.assignedStaffs);
          
          // ✅ PRESERVE: Nếu đã có assignedStaffs từ startAppointment response (có tên), giữ lại
          const isInProgress = ['in-progress', 'in_progress', 'inProgress'].includes(selectedAppointment?.status) &&
                               ['in-progress', 'in_progress', 'inProgress'].includes(detailedAppointment.status);
          
          const preservedAssignedStaffs = (selectedAppointment?.assignedStaffs && 
                                           selectedAppointment.assignedStaffs.length > 0 &&
                                           isInProgress &&
                                           selectedAppointment.assignedStaffs.some(s => s.fullName && s.fullName !== `Kỹ thuật viên #${s.id}`))
            ? selectedAppointment.assignedStaffs // Giữ tên đã map từ startAppointment (có fullName thật)
            : finalAssignedStaffs; // Hoặc dùng từ API
          
          const updatedAppointment = {
            ...detailedAppointment,
            // Assignment info - Ưu tiên preserve tên đã có
            assignedStaffs: preservedAssignedStaffs,
            hasAssignment: !!(preservedAssignedStaffs && preservedAssignedStaffs.length > 0),
            // Preserve local info as backup
            assignedTechnicianIds: detailedAppointment.assignedTechnicianIds || selectedAppointment.assignedTechnicianIds,
            assignedTechniciansCount: preservedAssignedStaffs?.length || detailedAppointment.assignedTechniciansCount || selectedAppointment.assignedTechniciansCount
          };
          
          console.log('✅ Final updatedAppointment:', {
            id: updatedAppointment.id,
            status: updatedAppointment.status,
            hasAssignment: updatedAppointment.hasAssignment,
            assignedStaffs: updatedAppointment.assignedStaffs,
            assignedTechniciansCount: updatedAppointment.assignedTechniciansCount
          });
          
          setSelectedAppointment(updatedAppointment);
        } catch (error) {
          console.error('❌ Error fetching appointment detail:', error);
          // Fallback: tìm trong freshAppointments
          const updatedAppointment = freshAppointments.find(apt => 
            apt.id === appointmentId || apt.appointmentId === appointmentId
          );
          
        if (updatedAppointment) {
            // Preserve assignment info
            setSelectedAppointment({
              ...updatedAppointment,
              assignedStaffs: updatedAppointment.assignedStaffs || selectedAppointment.assignedStaffs,
              assignedTechnicianIds: updatedAppointment.assignedTechnicianIds || selectedAppointment.assignedTechnicianIds,
              assignedTechniciansCount: updatedAppointment.assignedTechniciansCount || selectedAppointment.assignedTechniciansCount
            });
          }
        }
      }
      
      alert(`✅ Đã cập nhật trạng thái lịch hẹn #${appointmentId}`);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url
        }
      });
      
      let errorMessage = error.response?.data?.message || error.message;
      
      // Cải thiện error messages cho các HTTP codes khác nhau
      if (error.response?.status === 403) {
        // 403 Forbidden - Phân loại chi tiết hơn
        const originalError = error.response?.data?.message || '';
        
        if (newStatus === 'in-progress' || newStatus === 'in_progress') {
          // Lỗi khi start appointment
          errorMessage = '🚫 Không thể bắt đầu thực hiện\n\n' +
                        '❌ Nguyên nhân: ' + (originalError || 'Chưa đủ điều kiện') + '\n\n' +
                        '✅ Hãy kiểm tra:\n' +
                        '  1. Đã giao việc cho kỹ thuật viên chưa?\n' +
                        '  2. Đơn hàng đã được xác nhận chưa?\n' +
                        '  3. Token đăng nhập còn hiệu lực không?\n\n' +
                        '💡 Giải pháp: Bấm "Giao việc" để chọn kỹ thuật viên trước';
        } else if (newStatus === 'completed' || newStatus === 'done') {
          // Lỗi khi complete appointment
          errorMessage = '🚫 Không thể hoàn thành đơn hàng\n\n' +
                        '❌ Nguyên nhân: ' + (originalError || 'Chưa đủ điều kiện') + '\n\n' +
                        '✅ Hãy kiểm tra:\n' +
                        '  1. Đơn hàng đã bắt đầu thực hiện chưa?\n' +
                        '  2. Đã có kỹ thuật viên được giao chưa?\n' +
                        '  3. Các bước trước đã hoàn tất chưa?';
        } else {
          // Lỗi chung
          errorMessage = '🚫 Không có quyền thực hiện hành động này\n\n' +
                        '❌ Lỗi: ' + (originalError || 'Forbidden (403)') + '\n\n' +
                        '✅ Có thể do:\n' +
                        '  • Thiếu quyền truy cập\n' +
                        '  • Trạng thái đơn không hợp lệ\n' +
                        '  • Token đăng nhập hết hạn\n' +
                        '  • Đơn hàng không thuộc center của bạn';
        }
      } else if (error.response?.status === 401) {
        // 401 Unauthorized
        errorMessage = '🔐 Phiên đăng nhập đã hết hạn\n\n' +
                      'Vui lòng đăng nhập lại để tiếp tục.';
      } else if (error.response?.status === 400) {
        // 400 Bad Request
        errorMessage = '⚠️ Dữ liệu không hợp lệ\n\n' +
                      '❌ Lỗi: ' + (error.response?.data?.message || 'Bad Request') + '\n\n' +
                      'Vui lòng kiểm tra lại thông tin.';
      } else if (error.response?.status === 404) {
        // 404 Not Found
        errorMessage = '🔍 Không tìm thấy đơn hàng\n\n' +
                      'Đơn hàng có thể đã bị xóa hoặc không tồn tại.';
      } else if (error.response?.status >= 500) {
        // 5xx Server Error
        errorMessage = '💥 Lỗi server\n\n' +
                      'Server đang gặp sự cố. Vui lòng thử lại sau.\n\n' +
                      'Lỗi: ' + (error.response?.data?.message || error.message);
      }
      
      alert(`❌ Không thể cập nhật trạng thái:\n\n${errorMessage}`);
    }
  };

  // Handler để mở modal chọn technician
  const handleOpenTechnicianModal = (appointmentId) => {
    setAssigningAppointmentId(appointmentId);
    // Tìm technicians hiện tại nếu có (có thể có nhiều technicians đã được assign)
    const appointment = appointments.find(apt => 
      (apt.id === appointmentId || apt.appointmentId === appointmentId)
    );
    // Khởi tạo với technician hiện tại (nếu có)
    if (appointment?.technicianId) {
      setSelectedTechnicianIds([appointment.technicianId]);
    } else {
      setSelectedTechnicianIds([]);
    }
    setShowTechnicianModal(true);
  };

  // Toggle technician selection (checkbox behavior)
  const handleToggleTechnician = (techId) => {
    setSelectedTechnicianIds(prev => {
      if (prev.includes(techId)) {
        // Nếu đã chọn → bỏ chọn
        return prev.filter(id => id !== techId);
      } else {
        // Nếu chưa chọn → thêm vào
        return [...prev, techId];
      }
    });
  };

  // Handler để assign nhiều technicians
  // Handler để chọn appointment và fetch detail
  const handleSelectAppointment = async (appointment) => {
    try {
      console.log('🔍 Loading appointment detail:', appointment.id || appointment.appointmentId);
      
      // Fetch detailed data từ backend để có đầy đủ techIds, staffAssignments
      const detailedData = await getAppointmentById(appointment.id || appointment.appointmentId);
      console.log('✅ Detailed appointment loaded:', detailedData);
      
      setSelectedAppointment(detailedData);
    } catch (error) {
      console.error('❌ Error loading appointment detail:', error);
      
      // Nếu 403 hoặc lỗi khác, vẫn hiển thị data từ list
      console.log('⚠️ Fallback to appointment from list');
      setSelectedAppointment(appointment);
    }
  };

  const handleAssignTechnician = async () => {
    if (selectedTechnicianIds.length === 0) {
      alert('⚠️ Vui lòng chọn ít nhất 1 kỹ thuật viên');
      return;
    }

    // 🔍 Debug: Kiểm tra token và user info
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    console.log('🔐 Debug Giao Việc (Multi):');
    console.log('  ✅ Token tồn tại:', !!token);
    console.log('  📋 AppointmentId:', assigningAppointmentId);
    console.log('  👷 TechnicianIds:', selectedTechnicianIds);
    console.log('  📊 Số lượng:', selectedTechnicianIds.length);
    
    // Debug: Thông tin appointment
    const appointment = appointments.find(apt => 
      (apt.id === assigningAppointmentId || apt.appointmentId === assigningAppointmentId)
    );
    if (appointment) {
      console.log('  📌 Appointment Center ID:', appointment.serviceCenterId || appointment.service_center_id || appointment.centerId || appointment.center_id);
    }
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('  👤 User Role:', userData.role);
        console.log('  👤 User ID:', userData.id || userData.userId);
        console.log('  🏢 Center ID:', userData.center_id || userData.centerId);
      } catch (e) {
        console.error('  ❌ Không parse được user data');
      }
    }

    try {
      // Giao việc cho từng technician (gọi API nhiều lần)
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      let allAssignments = []; // Lưu tất cả assignments response từ API

      for (const techId of selectedTechnicianIds) {
        try {
          console.log(`  ⏳ Đang giao việc cho technician #${techId}...`);
          const result = await assignTechnician(assigningAppointmentId, techId);
          console.log(`  ✅ Giao việc cho #${techId} thành công:`, result);
          console.log(`  📦 Response type:`, Array.isArray(result) ? 'Array' : typeof result);
          console.log(`  📦 Response length:`, Array.isArray(result) ? result.length : 'N/A');
          
          // Response có thể là array of assignment objects từ database
          // Database structure: { assignment_id, staff_id, appointment_id, role, start_time, end_time, notes }
          if (Array.isArray(result)) {
            allAssignments = [...allAssignments, ...result];
            console.log(`  👥 Assignment objects:`, result.map(assignment => ({
              assignment_id: assignment.assignment_id || assignment.id,
              staff_id: assignment.staff_id || assignment.staffId,
              appointment_id: assignment.appointment_id || assignment.appointmentId,
              role: assignment.role,
              start_time: assignment.start_time || assignment.startTime,
              end_time: assignment.end_time || assignment.endTime,
              notes: assignment.notes,
              // Nếu có nested staff object
              staff: assignment.staff ? {
                id: assignment.staff.id,
                fullName: assignment.staff.fullName || assignment.staff.full_name,
                email: assignment.staff.email,
                phone: assignment.staff.phone
              } : null
            })));
          } else if (result && typeof result === 'object') {
            // Single assignment object
            allAssignments.push(result);
          }
          
          successCount++;
        } catch (err) {
          console.error(`  ❌ Lỗi giao việc cho #${techId}:`, err);
          errorCount++;
          errors.push({ techId, error: err.response?.data?.message || err.message });
        }
      }

      // Hiển thị kết quả
      if (errorCount === 0) {
        alert(`✅ Đã giao việc thành công cho ${successCount} kỹ thuật viên!`);
      } else if (successCount > 0) {
        alert(`⚠️ Giao việc một phần:\n✅ Thành công: ${successCount}\n❌ Thất bại: ${errorCount}\n\n${errors.map(e => `• Technician #${e.techId}: ${e.error}`).join('\n')}`);
      } else {
        alert(`❌ Không thể giao việc cho bất kỳ kỹ thuật viên nào:\n\n${errors.map(e => `• Technician #${e.techId}: ${e.error}`).join('\n')}`);
      }
      
      // Refresh danh sách appointments và lấy data mới
      console.log('🔄 Refreshing appointments after assignment...');
      const freshAppointments = await fetchAppointments();
      console.log('✅ Fresh appointments loaded:', freshAppointments.length);
      
      // Cập nhật selectedAppointment nếu đang xem chi tiết
      if (selectedAppointment?.id === assigningAppointmentId || selectedAppointment?.appointmentId === assigningAppointmentId) {
        // Parse staff info từ assignments response
        // Database structure: { assignment_id, staff_id, appointment_id, role, start_time, end_time, notes }
        const assignedStaffs = allAssignments.map(assignment => {
          // Case 1: Có nested staff object (backend đã join)
          if (assignment.staff) {
            return {
              id: assignment.staff.id || assignment.staff_id,
              fullName: assignment.staff.fullName || assignment.staff.full_name,
              email: assignment.staff.email,
              phone: assignment.staff.phone,
              working: assignment.staff.working || false,
              // Thêm thông tin assignment
              assignmentId: assignment.assignment_id || assignment.id,
              role: assignment.role || 'technician',
              startTime: assignment.start_time || assignment.startTime,
              endTime: assignment.end_time || assignment.endTime,
              notes: assignment.notes,
              appointmentId: assignment.appointment_id || assignment.appointmentId
            };
          }
          // Case 2: Direct staff fields (backend đã flatten)
          if (assignment.id || assignment.staff_id) {
            return {
              id: assignment.id || assignment.staff_id,
              fullName: assignment.fullName || assignment.full_name,
              email: assignment.email,
              phone: assignment.phone,
              working: assignment.working || false,
              // Thêm thông tin assignment
              assignmentId: assignment.assignment_id || assignment.id,
              role: assignment.role || 'technician',
              startTime: assignment.start_time || assignment.startTime,
              endTime: assignment.end_time || assignment.endTime,
              notes: assignment.notes,
              appointmentId: assignment.appointment_id || assignment.appointmentId
            };
          }
          // Case 3: Chỉ có staff_id (cần map với technicians list)
          if (assignment.staff_id) {
            const tech = technicians.find(t => t.id === assignment.staff_id || t.userId === assignment.staff_id);
            if (tech) {
              return {
                id: tech.id || tech.userId,
                fullName: tech.fullName || tech.name,
                email: tech.email,
                phone: tech.phone,
                working: tech.working || false,
                // Thêm thông tin assignment
                assignmentId: assignment.assignment_id,
                role: assignment.role || 'technician',
                startTime: assignment.start_time || assignment.startTime,
                endTime: assignment.end_time || assignment.endTime,
                notes: assignment.notes,
                appointmentId: assignment.appointment_id || assignment.appointmentId
              };
            }
            // Fallback nếu không tìm thấy
            return {
              id: assignment.staff_id,
              fullName: `Kỹ thuật viên #${assignment.staff_id}`,
              email: '',
              phone: '',
              working: false,
              assignmentId: assignment.assignment_id,
              role: assignment.role || 'technician',
              startTime: assignment.start_time || assignment.startTime,
              endTime: assignment.end_time || assignment.endTime,
              notes: assignment.notes,
              appointmentId: assignment.appointment_id || assignment.appointmentId
            };
          }
          return null;
        }).filter(s => s && s.id); // Remove invalid entries
        
        console.log('👥 Assigned staffs parsed:', assignedStaffs);
        
        // Cập nhật appointment với thông tin technician vừa giao
        const updatedAppointment = { 
          ...selectedAppointment,
          // Thêm flag để hiển thị "đã giao việc"
          hasAssignment: true,
          // Thông tin từ API response
          staffAssignments: allAssignments, // Full assignments
          assignedStaffs: assignedStaffs, // Parsed staff list
          // Backup info
          assignedTechnicianIds: selectedTechnicianIds,
          assignedTechniciansCount: successCount
        };
        
        console.log('✅ Updated appointment with assignment:', updatedAppointment);
          setSelectedAppointment(updatedAppointment);
        
        // Vẫn fetch lại list để đồng bộ UI
        try {
          console.log('🔄 Fetching appointment detail by ID:', assigningAppointmentId);
          const detailedAppointment = await getAppointmentById(assigningAppointmentId);
          console.log('✅ Detailed appointment fetched:', detailedAppointment);
          console.log('   🔍 All keys:', Object.keys(detailedAppointment));
          console.log('   👥 staffAssignments:', detailedAppointment.staffAssignments);
          
          // Parse staffAssignments từ detail API nếu có
          let assignedStaffsFromDetail = null;
          
          // Check techIds field (backend mới)
          if (detailedAppointment.techIds) {
            console.log('   🆕 Found techIds field:', detailedAppointment.techIds);
            
            // Parse techIds - có thể là string "1,2,3" hoặc array [1,2,3]
            let techIdsArray = [];
            if (typeof detailedAppointment.techIds === 'string') {
              techIdsArray = detailedAppointment.techIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            } else if (Array.isArray(detailedAppointment.techIds)) {
              techIdsArray = detailedAppointment.techIds.map(id => parseInt(id));
            }
            
            console.log('   📋 Parsed techIds array:', techIdsArray);
            
            // Map với danh sách technicians để lấy thông tin đầy đủ
            assignedStaffsFromDetail = techIdsArray.map(techId => {
              const tech = technicians.find(t => t.id === techId || t.userId === techId);
              if (tech) {
                return {
                  id: tech.id || tech.userId,
                  fullName: tech.fullName || tech.name,
                  email: tech.email,
                  phone: tech.phone,
                  working: tech.working
                };
              }
              // Fallback nếu không tìm thấy trong list
              return {
                id: techId,
                fullName: `Kỹ thuật viên #${techId}`,
                email: '',
                phone: ''
              };
            }).filter(s => s.id);
            
            console.log('   ✅ Mapped staffs from techIds:', assignedStaffsFromDetail);
          }
          // Fallback: Check staffAssignments (cách cũ)
          else if (detailedAppointment.staffAssignments && Array.isArray(detailedAppointment.staffAssignments)) {
            assignedStaffsFromDetail = detailedAppointment.staffAssignments.map(assignment => {
              if (assignment.staff) {
                return {
                  id: assignment.staff.id,
                  fullName: assignment.staff.fullName,
                  email: assignment.staff.email,
                  phone: assignment.staff.phone,
                  working: assignment.staff.working
                };
              }
              return {
                id: assignment.id,
                fullName: assignment.fullName,
                email: assignment.email,
                phone: assignment.phone,
                working: assignment.working
              };
            }).filter(s => s.id);
            console.log('   ✅ Parsed staffs from staffAssignments:', assignedStaffsFromDetail);
          }
          
          // Ưu tiên: assignedStaffsFromDetail > assignedStaffs from response > keep current
          const finalStaffs = assignedStaffsFromDetail && assignedStaffsFromDetail.length > 0
            ? assignedStaffsFromDetail
            : assignedStaffs; // từ response giao việc
          
          // Nếu detail API có thông tin technician, dùng nó
          if (detailedAppointment) {
            const finalAppointment = {
              ...detailedAppointment,
              // Đảm bảo giữ thông tin assignment
              hasAssignment: true,
              assignedStaffs: finalStaffs, // ⚠️ QUAN TRỌNG: Phải set assignedStaffs
              assignedTechnicianIds: selectedTechnicianIds,
              assignedTechniciansCount: finalStaffs.length || successCount
            };
            console.log('✅ Final appointment after assignment:', {
              id: finalAppointment.id,
              hasAssignment: finalAppointment.hasAssignment,
              assignedStaffs: finalAppointment.assignedStaffs,
              assignedTechniciansCount: finalAppointment.assignedTechniciansCount
            });
            setSelectedAppointment(finalAppointment);
          }
        } catch (error) {
          console.error('❌ Error fetching appointment detail:', error);
          console.log('   ⚠️ Keeping current state with assignedStaffs:', updatedAppointment.assignedStaffs);
          
          // Nếu lỗi 403, backend không cho phép detail API, nhưng đã có data từ local
          if (error.response?.status === 403) {
            console.log('   ℹ️ 403 Forbidden - Backend không hỗ trợ detail API, dùng local data');
          }
          // Vẫn giữ updatedAppointment với assignedStaffs đã set ở trên
        }
      }
      
      // Đóng modal nếu có ít nhất 1 thành công
      if (successCount > 0) {
        setShowTechnicianModal(false);
        setSelectedTechnicianIds([]);
        setAssigningAppointmentId(null);
      }
    } catch (error) {
      console.error('❌❌❌ CHI TIẾT LỖI GIAO VIỆC ❌❌❌');
      console.error('Full error object:', error);
      alert(`❌ Lỗi không mong đợi: ${error.message}`);
    }
  };

  const handleMaintenanceStatusChange = (maintenanceId, newStatus) => {
    setMaintenanceList(maintenanceList.map(item => 
      item.id === maintenanceId ? { ...item, status: newStatus } : item
    ));
    alert(`Đã cập nhật trạng thái bảo dưỡng ${maintenanceId}`);
  };

  const handleChecklistUpdate = (maintenanceId, checklistIndex, newStatus) => {
    setMaintenanceList(maintenanceList.map(item => {
      if (item.id === maintenanceId) {
        const updatedChecklist = [...item.checklist];
        updatedChecklist[checklistIndex] = { ...updatedChecklist[checklistIndex], status: newStatus };
        return { ...item, checklist: updatedChecklist };
      }
      return item;
    }));
  };

  // Handler thêm lịch hẹn mới
  const handleAddAppointment = async () => {
    try {
      console.log('📝 Creating new appointment:', newAppointment);
      console.log('🆕 Is new customer:', isNewCustomer);
      
      // Validate chung
      if (!newAppointment.vehicleId || !newAppointment.appointmentDate) {
        alert('⚠️ Vui lòng điền đầy đủ thông tin: Xe và Ngày hẹn');
        return;
      }

      // Validate khách hàng
      if (isNewCustomer) {
        // Khách hàng mới - validate thông tin
        if (!newAppointment.customerFullName || !newAppointment.customerPhone) {
          alert('⚠️ Vui lòng nhập đầy đủ: Tên khách hàng và Số điện thoại');
          return;
        }
        
        // Email validation (nếu có nhập)
        if (newAppointment.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAppointment.customerEmail)) {
          alert('⚠️ Email không hợp lệ');
          return;
        }
      } else {
        // Khách hàng có sẵn - validate customerId
        if (!newAppointment.customerId) {
          alert('⚠️ Vui lòng chọn khách hàng');
          return;
        }
      }

      // Format data theo backend API
      const appointmentData = {
        vehicleId: parseInt(newAppointment.vehicleId),
        serviceCenterId: staffCenterId, // Tự động lấy từ staff center
        serviceTypeIds: newAppointment.serviceTypes.map(id => parseInt(id)),
        appointmentDate: new Date(newAppointment.appointmentDate).toISOString(),
        notes: newAppointment.notes || ''
      };

      // Thêm thông tin khách hàng
      if (isNewCustomer) {
        // Gửi thông tin khách hàng mới (backend sẽ tạo customer mới hoặc tìm existing)
        appointmentData.customerInfo = {
          fullName: newAppointment.customerFullName.trim(),
          phone: newAppointment.customerPhone.trim(),
          email: newAppointment.customerEmail?.trim() || `guest_${Date.now()}@temp.com` // Temp email nếu không nhập
        };
        console.log('👤 New customer info:', appointmentData.customerInfo);
      } else {
        // Khách hàng có sẵn
        appointmentData.customerId = parseInt(newAppointment.customerId);
        console.log('👤 Existing customer ID:', appointmentData.customerId);
      }

      console.log('📤 Sending to API:', appointmentData);
      
      const result = await createAppointment(appointmentData);
      console.log('✅ Appointment created:', result);
      
      // Reset form và đóng modal
      setNewAppointment({
        customerId: '',
        vehicleId: '',
        serviceTypes: [],
        appointmentDate: '',
        notes: '',
        customerFullName: '',
        customerEmail: '',
        customerPhone: ''
      });
      setIsNewCustomer(false);
      setShowAddAppointmentModal(false);
      
      // Refresh danh sách appointments
      await fetchAppointments();
      
      alert('✅ Đã tạo lịch hẹn thành công!');
    } catch (error) {
      console.error('❌ Lỗi khi tạo lịch hẹn:', error);
      console.error('❌ Error details:', error.response?.data);
      alert(`❌ Không thể tạo lịch hẹn:\n${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-confirmed';
      case 'in-progress':
      case 'in_progress':
      case 'inProgress': return 'status-in-progress';
      case 'completed':
      case 'done': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'waiting': return 'status-waiting';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xác nhận';
      case 'accepted': return 'Đã xác nhận';
      case 'in-progress':
      case 'in_progress':
      case 'inProgress': return 'Đang thực hiện';
      case 'completed':
      case 'done': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'waiting': return 'Đang chờ';
      default: return status;
    }
  };

  return (
    <div className="staff-dashboard">
      {/* Header */}
      <div className="staff-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Quay lại
          </button>
          <h1>Dashboard Nhân Viên</h1>
        </div>
        <div className="header-right">
          <div className="staff-info">
            <div className="staff-avatar">
              <FaUser />
            </div>
            <div className="staff-details">
              <p className="staff-name">Nhân viên: Admin</p>
              <p className="staff-role">
                Quản lý khách hàng
                {staffCenterId !== null && staffCenterId !== undefined && (
                  <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#4CAF50', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                    Chi nhánh {staffCenterId}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <FaUser />
          Quản lý Khách hàng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          <FaCar />
          Quản lý Xe
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <FaCalendarAlt />
          Quản lý Lịch hẹn
        </button>
        <button 
          className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <FaTools />
          Quy trình Bảo dưỡng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
          onClick={() => setActiveTab('parts')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M21.71,8.71L20,10.41V18.29L21.71,20H22V21H18V20H18.29L20,18.29V13.91L14,7.91V4.59L15.71,2.88L16,2.59V2H20V3H19.71L18,4.71V7.91L19.41,9.32L20.82,7.91L21.71,8.71M11,10.5A0.5,0.5 0 0,1 10.5,11A0.5,0.5 0 0,1 10,10.5A0.5,0.5 0 0,1 10.5,10A0.5,0.5 0 0,1 11,10.5M13,10.5A0.5,0.5 0 0,1 12.5,11A0.5,0.5 0 0,1 12,10.5A0.5,0.5 0 0,1 12.5,10A0.5,0.5 0 0,1 13,10.5M13,18.5A0.5,0.5 0 0,1 12.5,19A0.5,0.5 0 0,1 12,18.5A0.5,0.5 0 0,1 12.5,18A0.5,0.5 0 0,1 13,18.5M11,18.5A0.5,0.5 0 0,1 10.5,19A0.5,0.5 0 0,1 10,18.5A0.5,0.5 0 0,1 10.5,18A0.5,0.5 0 0,1 11,18.5M8,20V22H4V20H4.29L6,18.29V10.41L4.29,8.71L3.41,9.59L2,8.18L6,4.18L10,8.18L8.59,9.59L7.71,8.71L6,10.41V18.29L7.71,20H8Z"/>
          </svg>
          Phụ tùng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <FaComments />
          Chat
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="customers-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng (tên, email, SĐT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm khách hàng
              </button>
            </div>

            <div className="content-layout">
              {/* Customer List */}
              <div className="customer-list">
                <h3>Danh sách khách hàng ({filteredCustomers.length})</h3>
                <div className="list-items">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Đang tải danh sách khách hàng...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <p>❌ {error}</p>
                      <button 
                        className="retry-btn" 
                        onClick={() => window.location.reload()}
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="empty-state">
                      <FaUser size={40} />
                      <p>Không tìm thấy khách hàng nào</p>
                    </div>
                  ) : (
                    filteredCustomers.map(customer => (
                      <div 
                        key={customer.id} 
                        className={`customer-item ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
                        onClick={() => handleCustomerClick(customer)}
                      >
                        <div className="customer-avatar">
                          <FaUser />
                        </div>
                        <div className="customer-info">
                          <h4>{customer.fullName || customer.name || 'Không có tên'}</h4>
                          <p>{customer.email}</p>
                          <div className="customer-stats">
                            <span><FaPhone /> {customer.phone || 'Chưa có'}</span>
                            <span>{customer.vehicles?.length || customer.cars?.length || 0} xe</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="customer-details">
                {selectedCustomer ? (
                  <>
                    <div className="details-header">
                      <div className="customer-avatar-large">
                        <FaUser />
                      </div>
                      <div>
                        <h2>{selectedCustomer.fullName || selectedCustomer.name || 'Không có tên'}</h2>
                        <p className="customer-id">ID: #{selectedCustomer.id}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Thông tin liên hệ</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <FaEnvelope />
                          <div>
                            <span className="label">Email</span>
                            <span className="value">{selectedCustomer.email}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaPhone />
                          <div>
                            <span className="label">Số điện thoại</span>
                            <span className="value">{selectedCustomer.phone || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCheckCircle />
                          <div>
                            <span className="label">Trạng thái</span>
                            <span className="value">
                              {selectedCustomer.status === 'ACTIVE' ? '✅ Hoạt động' : 
                               selectedCustomer.status === 'INACTIVE' ? '❌ Không hoạt động' : 
                               selectedCustomer.status || 'Chưa xác định'}
                            </span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Ngày tham gia</span>
                            <span className="value">
                              {selectedCustomer.joinDate || selectedCustomer.createdAt 
                                ? new Date(selectedCustomer.joinDate || selectedCustomer.createdAt).toLocaleDateString('vi-VN')
                                : 'Chưa có thông tin'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Danh sách xe ({(selectedCustomer.vehicles || selectedCustomer.cars)?.length || 0})</h3>
                      <div className="car-cards">
                        {((selectedCustomer.vehicles || selectedCustomer.cars) && (selectedCustomer.vehicles || selectedCustomer.cars).length > 0) ? (
                          (selectedCustomer.vehicles || selectedCustomer.cars).map(car => (
                            <div 
                              key={car.id || car.vehicleId} 
                              className="car-card-mini"
                              onClick={() => handleCarClick(car)}
                            >
                              <div className="car-icon">
                                <FaCar />
                              </div>
                              <div className="car-info-mini">
                                <h4>{car.model || `${car.brand || ''} ${car.model || ''}`.trim() || 'Xe'}</h4>
                                <p>Năm: {car.year || 'N/A'}</p>
                                <p>Biển số: {car.licensePlate || 'Chưa có'}</p>
                                <p>VIN: {car.vin || 'Chưa có'}</p>
                                {car.color && (
                                  <p>Màu: {car.color}</p>
                                )}
                                {(car.maintenanceCount !== undefined && car.maintenanceCount !== null) && (
                                  <p className="maintenance-count" style={{ color: '#667eea', fontWeight: '600' }}>
                                    ✓ Đã bảo trì: {car.maintenanceCount} lần
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>
                            Khách hàng chưa có xe nào
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedCar && (
                      <div className="details-section">
                        <h3>Lịch sử bảo trì - {selectedCar.model || selectedCar.brand || 'Xe'}</h3>
                        <div className="service-history-table">
                          {(selectedCar.maintenanceServices || selectedCar.serviceHistory) && 
                           (selectedCar.maintenanceServices || selectedCar.serviceHistory).length > 0 ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>STT</th>
                                  <th>Dịch vụ</th>
                                  <th>Thông tin</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedCar.maintenanceServices || selectedCar.serviceHistory).map((service, index) => (
                                  <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{service.serviceName || service.service || 'Dịch vụ bảo trì'}</td>
                                    <td>
                                      {service.date && (
                                        <div>Ngày: {new Date(service.date).toLocaleDateString('vi-VN')}</div>
                                      )}
                                      {service.cost && (
                                        <div>Chi phí: {typeof service.cost === 'number' 
                                          ? `${service.cost.toLocaleString('vi-VN')} VNĐ`
                                          : service.cost}
                                        </div>
                                      )}
                                      {service.status && (
                                        <span className="status-badge completed" style={{ marginTop: '5px' }}>
                                          {service.status}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ color: '#a0aec0', textAlign: 'center', padding: '20px' }}>
                              Xe chưa có lịch sử bảo trì
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    <FaUser size={60} />
                    <p>Chọn một khách hàng để xem chi tiết</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="cars-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm xe (VIN, biển số, model)..."
                />
              </div>
            </div>

            <div className="cars-grid">
              {customers.flatMap(customer => {
                const vehicles = customer.vehicles || customer.cars || [];
                return vehicles.map(car => (
                  <div key={car.id || car.vehicleId} className="car-card-full">
                    <div className="car-header">
                      <div className="car-icon-large">
                        <FaCar />
                      </div>
                      <div>
                        <h3>{car.model || `${car.brand || ''} ${car.model || ''}`.trim() || 'Xe'}</h3>
                        <p className="car-year">Năm {car.year || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="car-details-grid">
                      <div className="detail-row">
                        <span className="label">VIN:</span>
                        <span className="value">{car.vin || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Biển số:</span>
                        <span className="value">{car.licensePlate || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Màu:</span>
                        <span className="value">{car.color || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Chủ xe:</span>
                        <span className="value">{customer.fullName || customer.name || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="car-history-summary">
                      <FaHistory />
                      <span>{car.maintenanceCount || 0} lần bảo trì</span>
                    </div>
                  </div>
                ));
              })}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            {staffCenterId !== null && staffCenterId !== undefined && (
              <div style={{ 
                background: '#e3f2fd', 
                border: '1px solid #2196F3', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#1565C0'
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                <span style={{ fontWeight: '500' }}>
                  Bạn đang xem lịch hẹn của <strong>Chi nhánh {staffCenterId}</strong>
                </span>
              </div>
            )}
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch hẹn (tên khách hàng, biển số)..."
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedStatus && (
                  <button 
                    className="add-btn" 
                    onClick={() => setSelectedStatus(null)}
                    style={{ background: '#64748b' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
                    </svg>
                    Xóa bộ lọc
                  </button>
                )}
                <button 
                  className="add-btn"
                  onClick={() => setShowAddAppointmentModal(true)}
                >
                  <FaPlus />
                  Thêm lịch hẹn
                </button>
              </div>
            </div>

            <div className="appointments-stats">
              <div 
                className={`stat-card pending ${selectedStatus === 'pending' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('pending')}
                style={{ cursor: 'pointer' }}
              >
                <FaClock />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'pending').length}</h4>
                  <p>Chờ xác nhận</p>
                </div>
              </div>
              <div 
                className={`stat-card confirmed ${selectedStatus === 'accepted' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('accepted')}
                style={{ cursor: 'pointer' }}
              >
                <FaCheckCircle />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'accepted').length}</h4>
                  <p>Đã xác nhận</p>
                </div>
              </div>
              <div 
                className={`stat-card in-progress ${['in-progress', 'in_progress', 'inProgress'].includes(selectedStatus) ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('in_progress')}
                style={{ cursor: 'pointer' }}
              >
                <FaTools />
                <div>
                  <h4>{allAppointments.filter(a => ['in-progress', 'in_progress', 'inProgress'].includes(a.status)).length}</h4>
                  <p>Đang thực hiện</p>
                </div>
              </div>
              <div 
                className={`stat-card completed ${['completed', 'done'].includes(selectedStatus) ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('completed')}
                style={{ cursor: 'pointer' }}
              >
                <FaCheckCircle />
                <div>
                  <h4>{allAppointments.filter(a => ['completed', 'done'].includes(a.status)).length}</h4>
                  <p>Hoàn thành</p>
                </div>
              </div>
              <div 
                className={`stat-card cancelled ${selectedStatus === 'cancelled' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('cancelled')}
                style={{ cursor: 'pointer' }}
              >
                <FaTimes />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'cancelled').length}</h4>
                  <p>Đã hủy</p>
                </div>
              </div>
            </div>

            <div className="content-layout">
              {/* Appointments List */}
              <div className="appointments-list">
                <h3>
                  Danh sách lịch hẹn
                  {selectedStatus && (
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '400', 
                      color: '#667eea',
                      marginLeft: '10px'
                    }}>
                      (Lọc: {getStatusText(selectedStatus)})
                    </span>
                  )}
                  {!selectedStatus && allAppointments.length > 0 && (
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '400', 
                      color: '#666',
                      marginLeft: '10px'
                    }}>
                      (Tất cả: {allAppointments.length})
                    </span>
                  )}
                </h3>
                <div className="list-items">
                  {appointmentsLoading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Đang tải danh sách lịch hẹn...</p>
                    </div>
                  ) : appointmentsError ? (
                    <div className="error-state">
                      <p>❌ {appointmentsError}</p>
                      <button className="retry-btn" onClick={fetchAppointments}>
                        Thử lại
                      </button>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="empty-state">
                      <FaCalendarAlt size={40} />
                      <p>Chưa có lịch hẹn nào</p>
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
                      
                      // Lấy thông tin xe từ cache
                      const vehicle = vehiclesCache[appointment.vehicleId];
                      const vehicleDisplay = vehicle && !vehicle.error
                        ? `${vehicle.model || vehicle.brand || ''} ${vehicle.licensePlate ? `- ${vehicle.licensePlate}` : ''}`.trim()
                        : (appointment.carInfo || appointment.car_info || `Xe #${appointment.vehicleId || 'N/A'}`);
                      
                      return (
                        <div 
                          key={appointmentId}
                          className={`appointment-item ${selectedAppointment?.appointmentId === appointmentId ? 'active' : ''}`}
                          onClick={() => handleSelectAppointment(appointment)}
                        >
                          <div className="appointment-header">
                            <h4>
                              {appointment.fullName || 
                               appointment.customerName || 
                               appointment.customer_name || 
                               `Khách hàng #${appointment.customerId || 'N/A'}`}
                            </h4>
                            <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                          <p className="car-info">
                            {vehicleDisplay}
                          </p>
                          <p className="service-type">
                            {appointment.serviceType || 
                             appointment.service || 
                             appointment.serviceName ||
                             'Dịch vụ'}
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
                        <h2>Chi tiết lịch hẹn #{selectedAppointment.appointmentId || selectedAppointment.id}</h2>
                        <span className={`status-badge large ${getStatusColor(selectedAppointment.status)}`}>
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
                      <h3>Thông tin dịch vụ</h3>
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
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                          </svg>
                          <div>
                            <span className="label">Chi nhánh</span>
                            <span className="value">
                              Chi nhánh {selectedAppointment.centerId || selectedAppointment.serviceCenterId || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCalendarAlt />
                          <div>
                            <span className="label">Ngày hẹn</span>
                            <span className="value">
                              {selectedAppointment.appointmentDate 
                                ? new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN')
                                : selectedAppointment.date || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Giờ hẹn</span>
                            <span className="value">
                              {selectedAppointment.appointmentDate 
                                ? new Date(selectedAppointment.appointmentDate).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : selectedAppointment.time || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Kỹ thuật viên - Chỉ hiển thị khi đã xác nhận (không phải pending) */}
                    {selectedAppointment.status !== 'pending' && (
                    <div className="details-section">
                      <h3>Kỹ thuật viên phụ trách</h3>
                      {(() => {
                          // Check techIds field (backend mới)
                          let techIdsArray = [];
                          if (selectedAppointment.techIds) {
                            if (typeof selectedAppointment.techIds === 'string') {
                              techIdsArray = selectedAppointment.techIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                            } else if (Array.isArray(selectedAppointment.techIds)) {
                              techIdsArray = selectedAppointment.techIds.map(id => parseInt(id));
                            }
                          }
                          
                          // Check nhiều field names có thể từ backend (bao gồm cả snake_case và camelCase)
                        const techId = selectedAppointment.technicianId || 
                                      selectedAppointment.technician_id ||
                                        selectedAppointment.assignedTechnicianId ||
                                        selectedAppointment.assigned_technician_id ||
                                        selectedAppointment.techId;
                        
                        const techData = selectedAppointment.technician || 
                                          selectedAppointment.assignedTechnician ||
                                          selectedAppointment.assigned_technician;
                        
                          const assignedTechs = selectedAppointment.assignedStaffs || // Từ local state
                                               selectedAppointment.assignedTechnicians || 
                                               selectedAppointment.assigned_technicians ||
                                             selectedAppointment.technicians;
                        
                          // Check assignment status từ backend hoặc từ local state sau khi assign
                          const hasAssignment = techIdsArray.length > 0 || // Backend mới: có techIds
                                              selectedAppointment.hasAssignment || 
                                              selectedAppointment.has_assignment ||
                                              selectedAppointment.assignedTechnicianIds?.length > 0 || // Local flag
                                              selectedAppointment.assignedTechniciansCount > 0 || // Local flag
                                              techId || 
                                              techData || 
                                              (assignedTechs && assignedTechs.length > 0);
                        
                        // Debug log chi tiết
                        console.log('🔍 Appointment technician data:', {
                          appointmentId: selectedAppointment.id || selectedAppointment.appointmentId,
                          techIds: selectedAppointment.techIds,
                          techIdsArray,
                          techId,
                          techData,
                          assignedTechs,
                          assignedTechsLength: assignedTechs?.length,
                          hasAssignment,
                          'WILL SHOW ASSIGNED?': hasAssignment ? 'YES ✅' : 'NO ❌',
                          allKeys: Object.keys(selectedAppointment),
                          fullAppointment: selectedAppointment
                        });
                        
                        console.log('🎯 Decision:', hasAssignment ? 'HIỂN THỊ ĐÃ GIAO' : 'HIỂN THỊ CHƯA GIAO');
                        
                        if (hasAssignment) {
                          console.log('✅ Rendering: ĐÃ GIAO VIỆC section');
                          return (
                            <div className="technician-info">
                              <FaUserCog />
                              <span>
                                {(() => {
                                  // Ưu tiên 1: Hiển thị từ techIds (backend mới)
                                  if (techIdsArray.length > 0) {
                                    const techNames = techIdsArray.map(techId => {
                                      const tech = technicians.find(t => t.id === techId || t.userId === techId);
                                      return tech ? (tech.fullName || tech.name || `KTV #${techId}`) : `KTV #${techId}`;
                                    });
                                    return `${techNames.join(', ')} (${techNames.length} KTV)`;
                                  }
                                  
                                  // Ưu tiên 2: Hiển thị từ assignedStaffs (có đầy đủ thông tin từ API)
                                  if (selectedAppointment.assignedStaffs && selectedAppointment.assignedStaffs.length > 0) {
                                    const staffs = selectedAppointment.assignedStaffs;
                                    const names = staffs.map(s => s.fullName || `KTV #${s.id}`).filter(Boolean);
                                    if (names.length > 0) {
                                      return `${names.join(', ')} (${names.length} KTV)`;
                                    }
                                    return `${staffs.length} kỹ thuật viên đã được giao`;
                                  }
                                  
                                  // Fallback: từ local IDs (vừa assign, chưa có response)
                                  if (selectedAppointment.assignedTechniciansCount > 0) {
                                    const count = selectedAppointment.assignedTechniciansCount;
                                    const ids = selectedAppointment.assignedTechnicianIds || [];
                                    
                                    // Lấy tên technicians từ list
                                    const techNames = ids.map(id => {
                                      const tech = technicians.find(t => t.id === id || t.userId === id);
                                      return tech ? (tech.fullName || tech.name || `KTV #${id}`) : `KTV #${id}`;
                                    });
                                    
                                    if (techNames.length > 0) {
                                      return `${techNames.join(', ')} (${count} KTV)`;
                                    }
                                    return `${count} kỹ thuật viên đã được giao`;
                                  }
                                  
                                  // Nếu có array của nhiều technicians từ backend
                                  if (assignedTechs && assignedTechs.length > 0) {
                                    const names = assignedTechs.map(t => t.fullName || t.name).filter(Boolean);
                                    if (names.length > 0) {
                                      return `${names.join(', ')} (${names.length} KTV)`;
                                    }
                                    return `${assignedTechs.length} kỹ thuật viên đã được giao`;
                                  }
                                  
                                  // Nếu có techId, tìm từ danh sách
                                  if (techId) {
                                    const tech = technicians.find(t => 
                                      t.id === techId || t.userId === techId
                                    );
                                    if (tech) {
                                      return tech.fullName || tech.name || `Kỹ thuật viên #${tech.id}`;
                                    }
                                    return `Kỹ thuật viên #${techId}`;
                                  }
                                  
                                  // Nếu có techData object
                                  if (typeof techData === 'object') {
                                    return techData.fullName || techData.name || 'Đã giao việc';
                                  }
                                  
                                  // String hoặc fallback
                                  return techData || 'Đã giao việc';
                                })()}
                              </span>
                              <button 
                                className="sidebar-edit-btn"
                                onClick={() => handleOpenTechnicianModal(selectedAppointment.appointmentId || selectedAppointment.id)}
                                title="Thay đổi kỹ thuật viên"
                                style={{ marginLeft: 'auto' }}
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                                </svg>
                              </button>
                            </div>
                          );
                        }
                        
                        // Chưa giao việc
                        console.log('⚠️ Rendering: CHƯA GIAO VIỆC section');
                        return (
                          <div style={{ 
                            padding: '15px', 
                            background: '#fff3cd', 
                            border: '1px solid #ffc107',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px'
                          }}>
                            <span style={{ color: '#856404', fontSize: '14px' }}>
                              ⚠️ Chưa giao việc cho kỹ thuật viên
                            </span>
                            <button 
                              className="action-btn"
                              onClick={() => handleOpenTechnicianModal(selectedAppointment.appointmentId || selectedAppointment.id)}
                              style={{ 
                                padding: '8px 16px',
                                fontSize: '14px',
                                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                              }}
                            >
                              <FaUserCog />
                              Giao việc
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                    )}

                    <div className="details-section">
                      <h3>Ghi chú</h3>
                      <div className="notes-box">
                        <p>{selectedAppointment.notes || 'Không có ghi chú'}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Hành động</h3>
                      <div className="action-buttons">
                        {selectedAppointment.status === 'pending' && (
                          <>
                            <button 
                              className="action-btn confirm"
                              onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'accepted')}
                            >
                              <FaCheckCircle />
                              Xác nhận
                            </button>
                            <button 
                              className="action-btn cancel"
                              onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'cancelled')}
                            >
                              <FaTimes />
                              Hủy lịch
                            </button>
                          </>
                        )}
                        {selectedAppointment.status === 'accepted' && (
                          <>
                            {(() => {
                              // Check xem đã có techIds hoặc assignedStaffs chưa
                              let hasTechIds = false;
                              if (selectedAppointment.techIds) {
                                if (typeof selectedAppointment.techIds === 'string') {
                                  hasTechIds = selectedAppointment.techIds.trim().length > 0;
                                } else if (Array.isArray(selectedAppointment.techIds)) {
                                  hasTechIds = selectedAppointment.techIds.length > 0;
                                }
                              }
                              
                              // Check assignedStaffs (ưu tiên cao hơn vì local state)
                              const hasAssignedStaffs = selectedAppointment.assignedStaffs?.length > 0;
                              const hasAssignmentFlag = selectedAppointment.hasAssignment === true;
                              
                              console.log('🔍 Button visibility check:', {
                                hasTechIds,
                                hasAssignedStaffs,
                                hasAssignmentFlag,
                                assignedStaffsCount: selectedAppointment.assignedStaffs?.length
                              });
                              
                              // Nếu đã có technician được giao việc, hiển thị nút "Bắt đầu thực hiện"
                              if (hasTechIds || hasAssignedStaffs || hasAssignmentFlag) {
                                return (
                                  <>
                          <button 
                            className="action-btn start"
                                      onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'in_progress')}
                          >
                            <FaTools />
                            Bắt đầu thực hiện
                          </button>
                                    <button 
                                      className="action-btn cancel"
                                      onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'cancelled')}
                                    >
                                      <FaTimes />
                                      Hủy lịch
                                    </button>
                                  </>
                                );
                              }
                              
                              // Nếu chưa giao việc, hiển thị hint
                              return (
                                <>
                                  <button 
                                    className="action-btn cancel"
                                    onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'cancelled')}
                                  >
                                    <FaTimes />
                                    Hủy lịch
                                  </button>
                                  <div style={{
                                    padding: '12px 20px',
                                    background: '#fff3cd',
                                    border: '2px solid #ffc107',
                                    borderRadius: '10px',
                                    color: '#856404',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                      <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                                    </svg>
                                    ⚠️ Vui lòng giao việc cho kỹ thuật viên trước
                                  </div>
                                </>
                              );
                            })()}
                          </>
                        )}
                        {['in-progress', 'in_progress', 'inProgress'].includes(selectedAppointment.status) && (
                          <>
                            {(() => {
                              // Check xem đã giao việc cho technician chưa
                              const hasAssignment = selectedAppointment.hasAssignment || 
                                                   selectedAppointment.has_assignment ||
                                                   selectedAppointment.assignedStaffs?.length > 0 ||
                                                   selectedAppointment.assignedTechnicianIds?.length > 0 ||
                                                   selectedAppointment.assignedTechniciansCount > 0;
                              
                              const canComplete = hasAssignment;
                              
                              return (
                                <>
                          <button 
                                    className={`action-btn complete ${!canComplete ? 'disabled' : ''}`}
                                    onClick={() => {
                                      if (!canComplete) {
                                        alert('⚠️ Vui lòng giao việc cho kỹ thuật viên trước khi hoàn thành!');
                                        return;
                                      }
                                      handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'completed');
                                    }}
                                    disabled={!canComplete}
                                    title={!canComplete ? 'Cần giao việc cho kỹ thuật viên trước' : 'Hoàn thành đơn'}
                          >
                            <FaCheckCircle />
                            Hoàn thành
                                    {!canComplete && ' ⚠️'}
                          </button>
                                  <button 
                                    className="action-btn cancel"
                                    onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'cancelled')}
                                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                                  >
                                    <FaTimes />
                                    Hủy lịch
                                  </button>
                                </>
                              );
                            })()}
                          </>
                        )}
                        {['completed', 'done'].includes(selectedAppointment.status) && (
                          <div style={{ 
                            padding: '15px', 
                            background: '#d1fae5', 
                            border: '1px solid #10b981',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <FaCheckCircle style={{ color: '#10b981', fontSize: '24px' }} />
                            <p style={{ margin: '10px 0 0 0', color: '#065f46', fontWeight: '500' }}>
                              ✅ Lịch hẹn đã hoàn thành
                            </p>
                          </div>
                        )}
                        {selectedAppointment.status === 'cancelled' && (
                          <div style={{ 
                            padding: '15px', 
                            background: '#fee2e2', 
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            textAlign: 'center'
                          }}>
                            <FaTimes style={{ color: '#ef4444', fontSize: '24px' }} />
                            <p style={{ margin: '10px 0 0 0', color: '#991b1b', fontWeight: '500' }}>
                              ❌ Lịch hẹn đã bị hủy
                            </p>
                          </div>
                        )}
                        <button className="action-btn edit">
                          <FaEdit />
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <FaCalendarAlt size={60} />
                    <p>Chọn một lịch hẹn để xem chi tiết</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="maintenance-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo số phiếu, tên khách hàng, biển số..."
                />
              </div>
            </div>

            <div className="maintenance-stats">
              <div className="stat-card waiting">
                <FaClock />
                <div>
                  <h4>{maintenanceList.filter(m => m.status === 'waiting').length}</h4>
                  <p>Đang chờ</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <FaTools />
                <div>
                  <h4>{maintenanceList.filter(m => m.status === 'in-progress').length}</h4>
                  <p>Đang làm</p>
                </div>
              </div>
              <div className="stat-card completed">
                <FaCheckCircle />
                <div>
                  <h4>{maintenanceList.filter(m => m.status === 'completed').length}</h4>
                  <p>Hoàn tất</p>
                </div>
              </div>
            </div>

            <div className="content-layout">
              {/* Maintenance List */}
              <div className="maintenance-list">
                <h3>Danh sách phiếu dịch vụ</h3>
                <div className="list-items">
                  {maintenanceList.map(item => (
                    <div 
                      key={item.id}
                      className={`maintenance-item ${selectedMaintenance?.id === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedMaintenance(item)}
                    >
                      <div className="maintenance-header">
                        <div>
                          <h4>{item.ticketNumber}</h4>
                          <p className="customer-name">{item.customerName}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      <p className="car-info">{item.carInfo}</p>
                      <p className="service-type">{item.service}</p>
                      <div className="maintenance-footer">
                        <span className="technician">{item.technician}</span>
                        <span className="time">{item.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Details */}
              <div className="maintenance-details">
                {selectedMaintenance ? (
                  <>
                    <div className="details-header">
                      <div>
                        <h2>Phiếu dịch vụ: {selectedMaintenance.ticketNumber}</h2>
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
                            <span className="value">{selectedMaintenance.customerName}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCar />
                          <div>
                            <span className="label">Xe</span>
                            <span className="value">{selectedMaintenance.carInfo}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaUser />
                          <div>
                            <span className="label">Kỹ thuật viên</span>
                            <span className="value">{selectedMaintenance.technician}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Thời gian dự kiến</span>
                            <span className="value">{selectedMaintenance.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>VIN Number</h3>
                      <div className="vin-box">
                        <code>{selectedMaintenance.vin}</code>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Checklist EV - {selectedMaintenance.service}</h3>
                      <div className="checklist">
                        {selectedMaintenance.checklist.map((item, index) => (
                          <div key={index} className={`checklist-item ${item.status}`}>
                            <div className="checklist-info">
                              {item.status === 'completed' && <FaCheckCircle className="icon completed" />}
                              {item.status === 'in-progress' && <FaClock className="icon in-progress" />}
                              {item.status === 'pending' && <FaClock className="icon pending" />}
                              <span>{item.item}</span>
                            </div>
                            <div className="checklist-actions">
                              {item.status !== 'completed' && (
                                <>
                                  {item.status !== 'in-progress' && (
                                    <button 
                                      className="btn-small start"
                                      onClick={() => handleChecklistUpdate(selectedMaintenance.id, index, 'in-progress')}
                                    >
                                      Bắt đầu
                                    </button>
                                  )}
                                  <button 
                                    className="btn-small complete"
                                    onClick={() => handleChecklistUpdate(selectedMaintenance.id, index, 'completed')}
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
                        <div className="condition-item">
                          <strong>Ngoại thất:</strong>
                          <span>{selectedMaintenance.carCondition.exterior}</span>
                        </div>
                        <div className="condition-item">
                          <strong>Nội thất:</strong>
                          <span>{selectedMaintenance.carCondition.interior}</span>
                        </div>
                        <div className="condition-item">
                          <strong>Pin:</strong>
                          <span>{selectedMaintenance.carCondition.battery}</span>
                        </div>
                        <div className="condition-item">
                          <strong>Lốp xe:</strong>
                          <span>{selectedMaintenance.carCondition.tire}</span>
                        </div>
                        <div className="condition-notes">
                          <strong>Ghi chú:</strong>
                          <p>{selectedMaintenance.carCondition.notes}</p>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Cập nhật trạng thái</h3>
                      <div className="action-buttons">
                        {selectedMaintenance.status === 'waiting' && (
                          <button 
                            className="action-btn start"
                            onClick={() => handleMaintenanceStatusChange(selectedMaintenance.id, 'in-progress')}
                          >
                            <FaTools />
                            Bắt đầu thực hiện
                          </button>
                        )}
                        {selectedMaintenance.status === 'in-progress' && (
                          <button 
                            className="action-btn complete"
                            onClick={() => handleMaintenanceStatusChange(selectedMaintenance.id, 'completed')}
                          >
                            <FaCheckCircle />
                            Hoàn thành
                          </button>
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
        )}

        {/* Parts Tab */}
        {activeTab === 'parts' && (
          <div className="parts-section">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M21.71,8.71L20,10.41V18.29L21.71,20H22V21H18V20H18.29L20,18.29V13.91L14,7.91V4.59L15.71,2.88L16,2.59V2H20V3H19.71L18,4.71V7.91L19.41,9.32L20.82,7.91L21.71,8.71M11,10.5A0.5,0.5 0 0,1 10.5,11A0.5,0.5 0 0,1 10,10.5A0.5,0.5 0 0,1 10.5,10A0.5,0.5 0 0,1 11,10.5M13,10.5A0.5,0.5 0 0,1 12.5,11A0.5,0.5 0 0,1 12,10.5A0.5,0.5 0 0,1 12.5,10A0.5,0.5 0 0,1 13,10.5M13,18.5A0.5,0.5 0 0,1 12.5,19A0.5,0.5 0 0,1 12,18.5A0.5,0.5 0 0,1 12.5,18A0.5,0.5 0 0,1 13,18.5M11,18.5A0.5,0.5 0 0,1 10.5,19A0.5,0.5 0 0,1 10,18.5A0.5,0.5 0 0,1 10.5,18A0.5,0.5 0 0,1 11,18.5M8,20V22H4V20H4.29L6,18.29V10.41L4.29,8.71L3.41,9.59L2,8.18L6,4.18L10,8.18L8.59,9.59L7.71,8.71L6,10.41V18.29L7.71,20H8Z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>{partsList.length}</h3>
                  <p>Tổng phụ tùng</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#27ae60' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>{partsList.filter(p => p.status === 'in-stock').length}</h3>
                  <p>Còn hàng</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f39c12' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>{partsList.filter(p => p.status === 'low-stock').length}</h3>
                  <p>Sắp hết</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#e74c3c' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>{partsList.filter(p => p.status === 'out-of-stock').length}</h3>
                  <p>Hết hàng</p>
                </div>
              </div>
            </div>

            <div className="content-layout">
              {/* Parts List */}
              <div className="parts-list">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã phụ tùng, hãng..."
                    value={partsSearchQuery}
                    onChange={(e) => setPartsSearchQuery(e.target.value)}
                  />
                </div>
                <div className="list-items">
                  {filteredParts.map(part => (
                    <div 
                      key={part.id} 
                      className={`part-item ${selectedPart?.id === part.id ? 'active' : ''}`}
                      onClick={() => setSelectedPart(part)}
                    >
                      <div className="part-header">
                        <h4>{part.name}</h4>
                        <span className={`stock-badge ${part.status}`} style={{ backgroundColor: getStockStatusColor(part.status) }}>
                          {getStockStatusText(part.status)}
                        </span>
                      </div>
                      <p className="part-code">{part.partNumber}</p>
                      <p className="part-category">{part.category} • {part.brand}</p>
                      <div className="part-stock-info">
                        <span>Tồn kho: <strong>{part.stock}</strong></span>
                        <span className="part-price">{part.price.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts Details */}
              <div className="parts-details">
                {selectedPart ? (
                  <>
                    <div className="details-header">
                      <div>
                        <h2>{selectedPart.name}</h2>
                        <span className={`status-badge large ${selectedPart.status}`} style={{ backgroundColor: getStockStatusColor(selectedPart.status) }}>
                          {getStockStatusText(selectedPart.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h3>Thông tin chung</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                          </svg>
                          <div>
                            <span className="label">Mã phụ tùng</span>
                            <span className="value">{selectedPart.partNumber}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                          </svg>
                          <div>
                            <span className="label">Danh mục</span>
                            <span className="value">{selectedPart.category}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z"/>
                          </svg>
                          <div>
                            <span className="label">Hãng</span>
                            <span className="value">{selectedPart.brand}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCar />
                          <div>
                            <span className="label">Model</span>
                            <span className="value">{selectedPart.model}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Tồn kho & Giá</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M3,3H21V7H3V3M4,8H20V21H4V8M9.5,11A0.5,0.5 0 0,0 9,11.5V13H15V11.5A0.5,0.5 0 0,0 14.5,11H9.5Z"/>
                          </svg>
                          <div>
                            <span className="label">Số lượng tồn</span>
                            <span className="value">{selectedPart.stock} cái</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                          </svg>
                          <div>
                            <span className="label">Tồn tối thiểu</span>
                            <span className="value">{selectedPart.minStock} cái</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                          </svg>
                          <div>
                            <span className="label">Giá</span>
                            <span className="value">{selectedPart.price.toLocaleString('vi-VN')} đ</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                          </svg>
                          <div>
                            <span className="label">Vị trí</span>
                            <span className="value">{selectedPart.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Nhà cung cấp</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z"/>
                          </svg>
                          <div>
                            <span className="label">Tên</span>
                            <span className="value">{selectedPart.supplier.name}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaPhone />
                          <div>
                            <span className="label">Liên hệ</span>
                            <span className="value">{selectedPart.supplier.contact}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                          </svg>
                          <div>
                            <span className="label">Email</span>
                            <span className="value">{selectedPart.supplier.email}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Cập nhật</span>
                            <span className="value">{selectedPart.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Mô tả</h3>
                      <div className="description-box">
                        <p>{selectedPart.description}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Thông số kỹ thuật</h3>
                      <div className="specs-grid">
                        {Object.entries(selectedPart.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
                      <path d="M21.71,8.71L20,10.41V18.29L21.71,20H22V21H18V20H18.29L20,18.29V13.91L14,7.91V4.59L15.71,2.88L16,2.59V2H20V3H19.71L18,4.71V7.91L19.41,9.32L20.82,7.91L21.71,8.71M11,10.5A0.5,0.5 0 0,1 10.5,11A0.5,0.5 0 0,1 10,10.5A0.5,0.5 0 0,1 10.5,10A0.5,0.5 0 0,1 11,10.5M13,10.5A0.5,0.5 0 0,1 12.5,11A0.5,0.5 0 0,1 12,10.5A0.5,0.5 0 0,1 12.5,10A0.5,0.5 0 0,1 13,10.5M13,18.5A0.5,0.5 0 0,1 12.5,19A0.5,0.5 0 0,1 12,18.5A0.5,0.5 0 0,1 12.5,18A0.5,0.5 0 0,1 13,18.5M11,18.5A0.5,0.5 0 0,1 10.5,19A0.5,0.5 0 0,1 10,18.5A0.5,0.5 0 0,1 10.5,18A0.5,0.5 0 0,1 11,18.5M8,20V22H4V20H4.29L6,18.29V10.41L4.29,8.71L3.41,9.59L2,8.18L6,4.18L10,8.18L8.59,9.59L7.71,8.71L6,10.41V18.29L7.71,20H8Z"/>
                    </svg>
                    <p>Chọn phụ tùng để xem chi tiết</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="chat-section">
            <div className="chat-layout">
              {/* Chat List */}
              <div className="chat-list">
                <h3>Tin nhắn</h3>
                <div className="chat-items">
                  {chatCustomers.map(customer => (
                    <div 
                      key={customer.id}
                      className={`chat-item ${activeChatCustomer?.id === customer.id ? 'active' : ''}`}
                      onClick={() => handleChatCustomerClick(customer)}
                    >
                      <div className="chat-avatar">
                        <FaUser />
                        {customer.unread > 0 && (
                          <span className="unread-badge">{customer.unread}</span>
                        )}
                      </div>
                      <div className="chat-preview">
                        <h4>{customer.name}</h4>
                        <p>{customer.lastMessage}</p>
                      </div>
                      <span className="chat-time">{customer.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="chat-window">
                {activeChatCustomer ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-avatar">
                        <FaUser />
                      </div>
                      <div>
                        <h3>{activeChatCustomer.name}</h3>
                        <span className="online-status">Đang hoạt động</span>
                      </div>
                    </div>

                    <div className="chat-messages">
                      {chatMessages.map(message => (
                        <div 
                          key={message.id}
                          className={`message ${message.sender === 'staff' ? 'sent' : 'received'}`}
                        >
                          <div className="message-bubble">
                            <p>{message.text}</p>
                            <span className="message-time">{message.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form className="chat-input" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button type="submit">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="empty-state">
                    <FaComments size={60} />
                    <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal chọn Technician */}
      {showTechnicianModal && (
        <div className="modal-overlay" onClick={() => setShowTechnicianModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaUserCog style={{ marginRight: '10px' }} />
                Chọn Kỹ Thuật Viên (Có thể chọn nhiều)
              </h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowTechnicianModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {technicians.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px' }}>
                  <FaUserCog size={40} />
                  <p>Không có kỹ thuật viên nào</p>
                </div>
              ) : (
                <>
                  <div style={{ 
                    padding: '12px 16px', 
                    background: '#e3f2fd', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#1565C0'
                  }}>
                    ✅ Đã chọn: <strong>{selectedTechnicianIds.length}</strong> kỹ thuật viên
                  </div>
                  <div className="technicians-grid">
                    {technicians
                      .sort((a, b) => {
                        // Sắp xếp: Rảnh (working=false) lên trước, bận (working=true) xuống sau
                        if (a.working === b.working) return 0;
                        return a.working ? 1 : -1;
                      })
                      .map(tech => {
                      const techId = tech.id || tech.userId;
                      const isSelected = selectedTechnicianIds.includes(techId);
                        const isBusy = tech.working === true;
                      
                      return (
                        <div 
                          key={techId}
                            className={`technician-card ${isSelected ? 'selected' : ''} ${isBusy ? 'busy' : ''}`}
                          onClick={() => handleToggleTechnician(techId)}
                            style={{
                              opacity: isBusy ? 0.7 : 1,
                              border: isBusy ? '2px solid #fbbf24' : '2px solid #e2e8f0'
                            }}
                        >
                          <div className="technician-card-header">
                            <div className="technician-avatar-small">
                              <FaUserCog />
                            </div>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginLeft: 'auto'
                              }}>
                                {/* Status Badge */}
                                <span style={{
                                  fontSize: '11px',
                                  padding: '3px 8px',
                                  borderRadius: '12px',
                                  background: isBusy ? '#fef3c7' : '#d1fae5',
                                  color: isBusy ? '#92400e' : '#065f46',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <span style={{ fontSize: '8px' }}>{isBusy ? '🔴' : '🟢'}</span>
                                  {isBusy ? 'Đang bận' : 'Rảnh'}
                                </span>
                                {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                              </div>
                          </div>
                          <h4>{tech.fullName || tech.name || `Kỹ thuật viên #${tech.id}`}</h4>
                          {tech.email && (
                            <p style={{ fontSize: '13px', color: '#718096', margin: '5px 0 0 0' }}>
                              📧 {tech.email}
                            </p>
                          )}
                          {tech.phone && (
                            <p style={{ fontSize: '13px', color: '#718096', margin: '5px 0 0 0' }}>
                              📞 {tech.phone}
                            </p>
                          )}
                            {isBusy && tech.appointmentId && (
                              <p style={{ 
                                fontSize: '12px', 
                                color: '#92400e', 
                                margin: '8px 0 0 0',
                                padding: '4px 8px',
                                background: '#fef3c7',
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}>
                                ⚠️ Đang xử lý đơn #{tech.appointmentId}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={() => {
                  setShowTechnicianModal(false);
                  setSelectedTechnicianIds([]);
                  setAssigningAppointmentId(null);
                }}
              >
                Hủy
              </button>
              <button 
                className="modal-btn modal-btn-confirm"
                onClick={handleAssignTechnician}
                disabled={selectedTechnicianIds.length === 0}
              >
                <FaCheckCircle />
                Xác nhận giao việc ({selectedTechnicianIds.length} KTV)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Lịch Hẹn */}
      {showAddAppointmentModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddAppointmentModal(false);
          setIsNewCustomer(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Thêm Lịch Hẹn Mới</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddAppointmentModal(false);
                  setIsNewCustomer(false);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {/* Toggle Khách hàng mới / Có sẵn */}
              <div className="form-group" style={{ 
                background: '#f7fafc', 
                padding: '15px', 
                borderRadius: '10px',
                border: '2px dashed #e2e8f0'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  cursor: 'pointer',
                  marginBottom: 0
                }}>
                  <input
                    type="checkbox"
                    checked={isNewCustomer}
                    onChange={(e) => {
                      setIsNewCustomer(e.target.checked);
                      // Reset customer fields khi toggle
                      if (e.target.checked) {
                        setNewAppointment({...newAppointment, customerId: ''});
                      } else {
                        setNewAppointment({
                          ...newAppointment, 
                          customerFullName: '',
                          customerEmail: '',
                          customerPhone: ''
                        });
                      }
                    }}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, color: '#667eea' }}>
                    🆕 Khách hàng mới (không có tài khoản)
                  </span>
                </label>
              </div>

              {/* Form cho khách hàng có sẵn */}
              {!isNewCustomer && (
                <div className="form-group">
                  <label>
                    <FaUser /> Khách hàng <span style={{color: 'red'}}>*</span>
                  </label>
                  <select
                    value={newAppointment.customerId}
                    onChange={(e) => setNewAppointment({...newAppointment, customerId: e.target.value})}
                    className="form-control"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.fullName} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Form cho khách hàng mới */}
              {isNewCustomer && (
                <>
                  <div className="form-group">
                    <label>
                      <FaUser /> Tên khách hàng <span style={{color: 'red'}}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ tên đầy đủ"
                      value={newAppointment.customerFullName}
                      onChange={(e) => setNewAppointment({...newAppointment, customerFullName: e.target.value})}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaPhone /> Số điện thoại <span style={{color: 'red'}}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại (VD: 0912345678)"
                      value={newAppointment.customerPhone}
                      onChange={(e) => setNewAppointment({...newAppointment, customerPhone: e.target.value})}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FaEnvelope /> Email
                    </label>
                    <input
                      type="email"
                      placeholder="Nhập email (không bắt buộc)"
                      value={newAppointment.customerEmail}
                      onChange={(e) => setNewAppointment({...newAppointment, customerEmail: e.target.value})}
                      className="form-control"
                    />
                    <small style={{color: '#666', fontSize: '12px'}}>
                      💡 Email không bắt buộc cho khách hàng mới
                    </small>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>
                  <FaCar /> Xe <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập ID xe (Vehicle ID)"
                  value={newAppointment.vehicleId}
                  onChange={(e) => setNewAppointment({...newAppointment, vehicleId: e.target.value})}
                  className="form-control"
                />
                <small style={{color: '#666', fontSize: '12px'}}>
                  💡 Tip: Bạn có thể xem Vehicle ID trong tab "Quản lý xe"
                </small>
              </div>

              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Ngày & Giờ hẹn <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                  className="form-control"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="form-group">
                <label>
                  <FaTools /> Loại dịch vụ
                </label>
                <select
                  multiple
                  value={newAppointment.serviceTypes}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setNewAppointment({...newAppointment, serviceTypes: selectedOptions});
                  }}
                  className="form-control"
                  style={{minHeight: '100px'}}
                >
                  <option value="1">Bảo dưỡng định kỳ</option>
                  <option value="2">Sửa chữa phanh</option>
                  <option value="3">Thay lốp xe</option>
                  <option value="4">Kiểm tra pin</option>
                  <option value="5">Vệ sinh nội thất</option>
                </select>
                <small style={{color: '#666', fontSize: '12px'}}>
                  💡 Giữ Ctrl/Cmd để chọn nhiều dịch vụ
                </small>
              </div>

              <div className="form-group">
                <label>
                  <FaEdit /> Ghi chú
                </label>
                <textarea
                  placeholder="Nhập ghi chú cho lịch hẹn..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="form-control"
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={() => {
                  setShowAddAppointmentModal(false);
                  setIsNewCustomer(false);
                  setNewAppointment({
                    customerId: '',
                    vehicleId: '',
                    serviceTypes: [],
                    appointmentDate: '',
                    notes: '',
                    customerFullName: '',
                    customerEmail: '',
                    customerPhone: ''
                  });
                }}
              >
                Hủy
              </button>
              <button 
                className="modal-btn modal-btn-confirm"
                onClick={handleAddAppointment}
              >
                <FaCheckCircle />
                Tạo Lịch Hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
