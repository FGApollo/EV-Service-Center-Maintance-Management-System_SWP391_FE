import React, { useState } from 'react';
import './TechnicianDashboard.css';
import { 
  FaCar, FaTools, FaClock, FaCheckCircle, FaCalendarAlt, 
  FaClipboardList, FaExclamationTriangle, FaSearch, FaFileAlt, FaHistory
} from 'react-icons/fa';

function TechnicianDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('assigned');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Nhiệm vụ được giao
  const assignedTasks = [
    {
      id: 1,
      vehicle: { brand: 'Tesla', model: 'Model 3', year: 2023, licensePlate: '29A-12345', vin: 'WBA3B5C50DF123456' },
      customer: { name: 'Nguyễn Văn A', phone: '0123456789' },
      serviceType: 'Bảo dưỡng định kỳ',
      priority: 'high',
      status: 'in-progress',
      scheduledDate: '2024-11-07',
      estimatedTime: '2 giờ',
      startTime: '08:00',
      tasks: [
        { id: 1, name: 'Kiểm tra hệ thống pin', completed: true },
        { id: 2, name: 'Kiểm tra động cơ điện', completed: true },
        { id: 3, name: 'Thay dầu phanh', completed: false }
      ],
      notes: 'Khách hàng yêu cầu kiểm tra kỹ hệ thống pin'
    }
  ];

  const completedTasks = [
    { id: 101, vehicle: { brand: 'BMW', model: 'i3', licensePlate: '29X-98765' }, customer: { name: 'Phạm Văn D' }, serviceType: 'Bảo dưỡng định kỳ', completedDate: '2024-11-06', duration: '1.5 giờ', rating: 5 }
  ];

  const stats = { tasksToday: 3, inProgress: 1, completed: 2, pending: 2, avgRating: 4.8, totalCompleted: 45 };

  return (
    <div className='technician-dashboard'>
      <div className='dashboard-header'>
        <div className='header-content'>
          <div className='welcome-section'>
            <h1> Dashboard Kỹ Thuật Viên</h1>
            <p>Chào mừng trở lại! Hôm nay bạn có {stats.tasksToday} nhiệm vụ</p>
          </div>
          <button className='btn-back' onClick={() => onNavigate?.('/')}> Quay lại</button>
        </div>
      </div>
      <div className='stats-overview'>
        <div className='stat-card'><div className='stat-icon' style={{backgroundColor: '#2196f3'}}><FaClipboardList /></div><div className='stat-info'><h3>{stats.tasksToday}</h3><p>Nhiệm vụ hôm nay</p></div></div>
        <div className='stat-card'><div className='stat-icon' style={{backgroundColor: '#ff9800'}}><FaClock /></div><div className='stat-info'><h3>{stats.inProgress}</h3><p>Đang thực hiện</p></div></div>
        <div className='stat-card'><div className='stat-icon' style={{backgroundColor: '#4caf50'}}><FaCheckCircle /></div><div className='stat-info'><h3>{stats.completed}</h3><p>Đã hoàn thành</p></div></div>
        <div className='stat-card'><div className='stat-icon' style={{backgroundColor: '#9c27b0'}}><FaFileAlt /></div><div className='stat-info'><h3>{stats.avgRating} </h3><p>Đánh giá trung bình</p></div></div>
      </div>
      <div className='dashboard-tabs'>
        <button className={	ab-btn } onClick={() => setActiveTab('assigned')}><FaTools />Nhiệm vụ được giao</button>
        <button className={	ab-btn } onClick={() => setActiveTab('history')}><FaHistory />Lịch sử công việc</button>
      </div>
      <div className='dashboard-content'>
        {activeTab === 'assigned' && <div className='assigned-tasks-section'><div className='section-header'><h2> Nhiệm vụ được giao hôm nay</h2></div><div className='tasks-grid'>{assignedTasks.map(task => <div key={task.id} className='task-card'><div className='vehicle-info'><div className='vehicle-icon'><FaCar /></div><div><h3>{task.vehicle.brand} {task.vehicle.model}</h3><p>Biển số: {task.vehicle.licensePlate}</p></div></div><p> {task.customer.name}</p></div>)}</div></div>}
        {activeTab === 'history' && <div className='history-section'><h2> Lịch sử công việc</h2><table><thead><tr><th>Ngày</th><th>Xe</th><th>Khách hàng</th><th>Dịch vụ</th></tr></thead><tbody>{completedTasks.map(t => <tr key={t.id}><td>{t.completedDate}</td><td>{t.vehicle.brand}</td><td>{t.customer.name}</td><td>{t.serviceType}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}

export default TechnicianDashboard;
