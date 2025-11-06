import React, { useState, useEffect } from 'react';
import './StaffDashboard.css';
import { FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, FaEdit, FaUserCog } from 'react-icons/fa';
import { getCustomersByRole, getAppointmentsForStaff, acceptAppointment, cancelAppointment, startAppointment, completeAppointment, getVehicleById, getTechnicians, assignTechnician } from '../api';

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
      const filtered = allAppointments.filter(apt => apt.status === selectedStatus);
      console.log(`🔍 Lọc client-side: status=${selectedStatus}, từ ${allAppointments.length} → ${filtered.length}`);
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
      console.log('🔄 Đang fetch TẤT CẢ lịch hẹn... Staff Center ID:', staffCenterId);
      
      // Luôn fetch TẤT CẢ lịch hẹn (không filter theo status ở API)
      const data = await getAppointmentsForStaff(null);
      console.log('📦 Dữ liệu từ API:', data);
      console.log('📦 Số lượng:', Array.isArray(data) ? data.length : 'Không phải array');
      
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
        console.log('🔬 Keys:', Object.keys(data[0]));
      }
      
      // Lọc lịch hẹn theo center_id của staff (nếu có)
      let filteredData = data;
      if (staffCenterId !== null && staffCenterId !== undefined) {
        filteredData = data.filter(appointment => {
          // Kiểm tra cả camelCase và snake_case
          const aptCenterId = appointment.serviceCenterId || appointment.service_center_id || appointment.centerId || appointment.center_id;
          const appointmentId = appointment.id || appointment.appointmentId;
          console.log(`🔍 Lịch hẹn #${appointmentId}: centerId=${aptCenterId}, Staff centerId=${staffCenterId}, Match=${aptCenterId === staffCenterId}`);
          return aptCenterId === staffCenterId;
        });
        console.log('✅ Đã lọc lịch hẹn theo center_id:', staffCenterId);
        console.log('📊 Tổng số lịch hẹn:', data.length, '→ Lịch hẹn của chi nhánh:', filteredData.length);
      } else {
        // Nếu không có center_id, hiển thị tất cả (trường hợp admin hoặc role khác)
        console.log('⚠️ Không tìm thấy center_id, hiển thị tất cả lịch hẹn:', data.length);
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
      // Gọi API tương ứng với từng action
      switch(newStatus) {
        case 'confirmed':
          await acceptAppointment(appointmentId);
          break;
        case 'cancelled':
          await cancelAppointment(appointmentId);
          break;
        case 'in-progress':
          await startAppointment(appointmentId);
          break;
        case 'completed':
          await completeAppointment(appointmentId);
          break;
        default:
          throw new Error('Trạng thái không hợp lệ');
      }
      
      // Refresh danh sách appointments sau khi cập nhật
      await fetchAppointments();
      
      // Cập nhật selectedAppointment nếu đang xem chi tiết
      if (selectedAppointment?.id === appointmentId) {
        const updatedAppointment = appointments.find(apt => apt.id === appointmentId);
        if (updatedAppointment) {
          setSelectedAppointment({ ...updatedAppointment, status: newStatus });
        }
      }
      
      alert(`✅ Đã cập nhật trạng thái lịch hẹn #${appointmentId}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert(`❌ Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`);
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

      for (const techId of selectedTechnicianIds) {
        try {
          console.log(`  ⏳ Đang giao việc cho technician #${techId}...`);
          const result = await assignTechnician(assigningAppointmentId, techId);
          console.log(`  ✅ Giao việc cho #${techId} thành công:`, result);
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
        // Tìm appointment từ data MỚI (vừa fetch về)
        const updatedAppointment = freshAppointments.find(apt => 
          (apt.id === assigningAppointmentId || apt.appointmentId === assigningAppointmentId)
        );
        
        if (updatedAppointment) {
          console.log('✅ Updated appointment found:', updatedAppointment);
          console.log('   🔍 TechnicianId:', updatedAppointment.technicianId);
          console.log('   🔍 Technician:', updatedAppointment.technician);
          console.log('   🔍 AssignedTechnicians:', updatedAppointment.assignedTechnicians);
          setSelectedAppointment(updatedAppointment);
        } else {
          console.warn('⚠️ Updated appointment not found in fresh data');
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'waiting': return 'status-waiting';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
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
                <button className="add-btn">
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
                className={`stat-card confirmed ${selectedStatus === 'confirmed' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('confirmed')}
                style={{ cursor: 'pointer' }}
              >
                <FaCheckCircle />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'confirmed').length}</h4>
                  <p>Đã xác nhận</p>
                </div>
              </div>
              <div 
                className={`stat-card in-progress ${selectedStatus === 'in-progress' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('in-progress')}
                style={{ cursor: 'pointer' }}
              >
                <FaTools />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'in-progress').length}</h4>
                  <p>Đang thực hiện</p>
                </div>
              </div>
              <div 
                className={`stat-card completed ${selectedStatus === 'completed' ? 'active-filter' : ''}`}
                onClick={() => handleStatusFilter('completed')}
                style={{ cursor: 'pointer' }}
              >
                <FaCheckCircle />
                <div>
                  <h4>{allAppointments.filter(a => a.status === 'completed').length}</h4>
                  <p>Hoàn thành</p>
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

                    <div className="details-section">
                      <h3>Kỹ thuật viên phụ trách</h3>
                      {(() => {
                        // Check nhiều field names có thể từ backend
                        const techId = selectedAppointment.technicianId || 
                                      selectedAppointment.technician_id ||
                                      selectedAppointment.assignedTechnicianId;
                        
                        const techData = selectedAppointment.technician || 
                                        selectedAppointment.assignedTechnician;
                        
                        const assignedTechs = selectedAppointment.assignedTechnicians || 
                                             selectedAppointment.technicians;
                        
                        const hasAssignment = techId || techData || (assignedTechs && assignedTechs.length > 0);
                        
                        // Debug log
                        console.log('🔍 Appointment technician data:', {
                          techId,
                          techData,
                          assignedTechs,
                          hasAssignment,
                          fullAppointment: selectedAppointment
                        });
                        
                        if (hasAssignment) {
                          return (
                            <div className="technician-info">
                              <FaUserCog />
                              <span>
                                {(() => {
                                  // Nếu có array của nhiều technicians
                                  if (assignedTechs && assignedTechs.length > 0) {
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
                                  
                                  // String
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
                              onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'confirmed')}
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
                        {selectedAppointment.status === 'confirmed' && (
                          <button 
                            className="action-btn start"
                            onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'in-progress')}
                          >
                            <FaTools />
                            Bắt đầu thực hiện
                          </button>
                        )}
                        {selectedAppointment.status === 'in-progress' && (
                          <button 
                            className="action-btn complete"
                            onClick={() => handleAppointmentStatusChange(selectedAppointment.appointmentId || selectedAppointment.id, 'completed')}
                          >
                            <FaCheckCircle />
                            Hoàn thành
                          </button>
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
                    {technicians.map(tech => {
                      const techId = tech.id || tech.userId;
                      const isSelected = selectedTechnicianIds.includes(techId);
                      
                      return (
                        <div 
                          key={techId}
                          className={`technician-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleTechnician(techId)}
                        >
                          <div className="technician-card-header">
                            <div className="technician-avatar-small">
                              <FaUserCog />
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ marginLeft: 'auto', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
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
    </div>
  );
}

export default StaffDashboard;
