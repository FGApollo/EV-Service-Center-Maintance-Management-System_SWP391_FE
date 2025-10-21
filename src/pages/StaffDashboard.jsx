import React, { useState } from 'react';
import './StaffDashboard.css';
import { FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, FaEdit } from 'react-icons/fa';

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

  // Dữ liệu mẫu khách hàng
  const [customers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      joinDate: '2024-01-15',
      totalVisits: 12,
      cars: [
        {
          id: 101,
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          vin: 'WBA3B5C50DF123456',
          licensePlate: '29A-12345',
          color: 'Đỏ',
          serviceHistory: [
            { date: '2025-09-15', service: 'Bảo dưỡng định kỳ', cost: '1,500,000 VNĐ', status: 'Hoàn thành' },
            { date: '2025-06-10', service: 'Thay dầu máy', cost: '500,000 VNĐ', status: 'Hoàn thành' },
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      joinDate: '2024-03-20',
      totalVisits: 8,
      cars: [
        {
          id: 102,
          brand: 'VinFast',
          model: 'VF e34',
          year: 2024,
          vin: 'VF8A1B2C3D4E56789',
          licensePlate: '30B-67890',
          color: 'Trắng',
          serviceHistory: [
            { date: '2025-10-01', service: 'Kiểm tra tổng quát', cost: '800,000 VNĐ', status: 'Hoàn thành' },
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0912345678',
      address: '789 Đường DEF, Quận 5, TP.HCM',
      joinDate: '2024-07-10',
      totalVisits: 5,
      cars: [
        {
          id: 103,
          brand: 'BMW',
          model: 'i4',
          year: 2023,
          vin: 'BMW5C50DF789012',
          licensePlate: '51C-11111',
          color: 'Xanh',
          serviceHistory: [
            { date: '2025-09-25', service: 'Thay lốp', cost: '2,000,000 VNĐ', status: 'Hoàn thành' },
          ]
        }
      ]
    }
  ]);

  // Dữ liệu chat mẫu
  const [chatCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Cảm ơn bạn!', time: '10:30', unread: 2 },
    { id: 2, name: 'Trần Thị B', lastMessage: 'Xe của tôi đã sẵn sàng chưa?', time: '09:15', unread: 0 },
    { id: 3, name: 'Lê Văn C', lastMessage: 'Tôi muốn đặt lịch', time: 'Hôm qua', unread: 1 },
  ]);

  // Dữ liệu lịch hẹn
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      phone: '0123456789',
      carInfo: 'Tesla Model 3 - 29A-12345',
      service: 'Bảo dưỡng định kỳ',
      date: '2025-10-20',
      time: '09:00',
      status: 'pending', // pending, confirmed, in-progress, completed, cancelled
      technician: null,
      notes: 'Khách hàng yêu cầu kiểm tra hệ thống phanh'
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      phone: '0987654321',
      carInfo: 'VinFast VF e34 - 30B-67890',
      service: 'Thay lốp xe',
      date: '2025-10-20',
      time: '10:30',
      status: 'confirmed',
      technician: 'Kỹ thuật viên: Phạm Văn D',
      notes: 'Thay 4 lốp mới'
    },
    {
      id: 3,
      customerName: 'Lê Văn C',
      phone: '0912345678',
      carInfo: 'BMW i4 - 51C-11111',
      service: 'Kiểm tra tổng quát',
      date: '2025-10-21',
      time: '14:00',
      status: 'in-progress',
      technician: 'Kỹ thuật viên: Nguyễn Văn E',
      notes: 'Kiểm tra hệ thống điện'
    },
    {
      id: 4,
      customerName: 'Hoàng Thị F',
      phone: '0934567890',
      carInfo: 'Tesla Model Y - 60A-22222',
      service: 'Sửa chữa động cơ',
      date: '2025-10-19',
      time: '08:00',
      status: 'completed',
      technician: 'Kỹ thuật viên: Trần Văn G',
      notes: 'Đã hoàn thành kiểm tra và sửa chữa'
    }
  ]);

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

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

  const handleAppointmentStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    alert(`Đã cập nhật trạng thái lịch hẹn #${appointmentId}`);
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
              <p className="staff-role">Quản lý khách hàng</p>
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
                  {filteredCustomers.map(customer => (
                    <div 
                      key={customer.id} 
                      className={`customer-item ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <div className="customer-avatar">
                        <FaUser />
                      </div>
                      <div className="customer-info">
                        <h4>{customer.name}</h4>
                        <p>{customer.email}</p>
                        <div className="customer-stats">
                          <span><FaPhone /> {customer.phone}</span>
                          <span>{customer.cars.length} xe</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        <h2>{selectedCustomer.name}</h2>
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
                            <span className="value">{selectedCustomer.phone}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaMapMarkerAlt />
                          <div>
                            <span className="label">Địa chỉ</span>
                            <span className="value">{selectedCustomer.address}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Ngày tham gia</span>
                            <span className="value">{selectedCustomer.joinDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Danh sách xe ({selectedCustomer.cars.length})</h3>
                      <div className="car-cards">
                        {selectedCustomer.cars.map(car => (
                          <div 
                            key={car.id} 
                            className="car-card-mini"
                            onClick={() => handleCarClick(car)}
                          >
                            <div className="car-icon">
                              <FaCar />
                            </div>
                            <div className="car-info-mini">
                              <h4>{car.brand} {car.model}</h4>
                              <p>Biển số: {car.licensePlate}</p>
                              <p>VIN: {car.vin}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedCar && (
                      <div className="details-section">
                        <h3>Lịch sử dịch vụ - {selectedCar.brand} {selectedCar.model}</h3>
                        <div className="service-history-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Ngày</th>
                                <th>Dịch vụ</th>
                                <th>Chi phí</th>
                                <th>Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedCar.serviceHistory.map((service, index) => (
                                <tr key={index}>
                                  <td>{service.date}</td>
                                  <td>{service.service}</td>
                                  <td className="cost">{service.cost}</td>
                                  <td><span className="status-badge completed">{service.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
              {customers.flatMap(customer => 
                customer.cars.map(car => (
                  <div key={car.id} className="car-card-full">
                    <div className="car-header">
                      <div className="car-icon-large">
                        <FaCar />
                      </div>
                      <div>
                        <h3>{car.brand} {car.model}</h3>
                        <p className="car-year">Năm {car.year}</p>
                      </div>
                    </div>
                    
                    <div className="car-details-grid">
                      <div className="detail-row">
                        <span className="label">VIN:</span>
                        <span className="value">{car.vin}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Biển số:</span>
                        <span className="value">{car.licensePlate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Màu:</span>
                        <span className="value">{car.color}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Chủ xe:</span>
                        <span className="value">{customers.find(c => c.cars.some(cr => cr.id === car.id))?.name}</span>
                      </div>
                    </div>

                    <div className="car-history-summary">
                      <FaHistory />
                      <span>{car.serviceHistory.length} lần bảo dưỡng</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch hẹn (tên khách hàng, biển số)..."
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm lịch hẹn
              </button>
            </div>

            <div className="appointments-stats">
              <div className="stat-card pending">
                <FaClock />
                <div>
                  <h4>{appointments.filter(a => a.status === 'pending').length}</h4>
                  <p>Chờ xác nhận</p>
                </div>
              </div>
              <div className="stat-card confirmed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => a.status === 'confirmed').length}</h4>
                  <p>Đã xác nhận</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <FaTools />
                <div>
                  <h4>{appointments.filter(a => a.status === 'in-progress').length}</h4>
                  <p>Đang thực hiện</p>
                </div>
              </div>
              <div className="stat-card completed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => a.status === 'completed').length}</h4>
                  <p>Hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="content-layout">
              {/* Appointments List */}
              <div className="appointments-list">
                <h3>Danh sách lịch hẹn</h3>
                <div className="list-items">
                  {appointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className={`appointment-item ${selectedAppointment?.id === appointment.id ? 'active' : ''}`}
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="appointment-header">
                        <h4>{appointment.customerName}</h4>
                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <p className="car-info">{appointment.carInfo}</p>
                      <p className="service-type">{appointment.service}</p>
                      <div className="appointment-time">
                        <FaCalendarAlt />
                        <span>{appointment.date} - {appointment.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="appointment-details">
                {selectedAppointment ? (
                  <>
                    <div className="details-header">
                      <div>
                        <h2>Chi tiết lịch hẹn #{selectedAppointment.id}</h2>
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
                            <span className="value">{selectedAppointment.customerName}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaPhone />
                          <div>
                            <span className="label">Số điện thoại</span>
                            <span className="value">{selectedAppointment.phone}</span>
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
                            <span className="value">{selectedAppointment.carInfo}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaTools />
                          <div>
                            <span className="label">Loại dịch vụ</span>
                            <span className="value">{selectedAppointment.service}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCalendarAlt />
                          <div>
                            <span className="label">Ngày hẹn</span>
                            <span className="value">{selectedAppointment.date}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <div>
                            <span className="label">Giờ hẹn</span>
                            <span className="value">{selectedAppointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedAppointment.technician && (
                      <div className="details-section">
                        <h3>Kỹ thuật viên phụ trách</h3>
                        <div className="technician-info">
                          <FaUser />
                          <span>{selectedAppointment.technician}</span>
                        </div>
                      </div>
                    )}

                    <div className="details-section">
                      <h3>Ghi chú</h3>
                      <div className="notes-box">
                        <p>{selectedAppointment.notes}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>Hành động</h3>
                      <div className="action-buttons">
                        {selectedAppointment.status === 'pending' && (
                          <>
                            <button 
                              className="action-btn confirm"
                              onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'confirmed')}
                            >
                              <FaCheckCircle />
                              Xác nhận
                            </button>
                            <button 
                              className="action-btn cancel"
                              onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'cancelled')}
                            >
                              <FaTimes />
                              Hủy lịch
                            </button>
                          </>
                        )}
                        {selectedAppointment.status === 'confirmed' && (
                          <button 
                            className="action-btn start"
                            onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'in-progress')}
                          >
                            <FaTools />
                            Bắt đầu thực hiện
                          </button>
                        )}
                        {selectedAppointment.status === 'in-progress' && (
                          <button 
                            className="action-btn complete"
                            onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'completed')}
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
    </div>
  );
}

export default StaffDashboard;
