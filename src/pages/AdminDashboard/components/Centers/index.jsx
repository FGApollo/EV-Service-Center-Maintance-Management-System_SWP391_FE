import React, { useEffect, useState } from 'react';
import { FaWarehouse, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useCenters } from '../../hooks/useCenters';

export const CentersTab = () => {
  const { centers, loading, error, fetchCenters, addCenter, updateCenter, deleteCenter } = useCenters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', email: '', phone: '' });

  useEffect(() => { fetchCenters(); }, [fetchCenters]);

  // Filter centers
  const filteredCenters = centers.filter(center => {
    const name = (center.name || '').toLowerCase();
    const address = (center.address || '').toLowerCase();
    const email = (center.email || '').toLowerCase();
    const phone = (center.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      name.includes(query) ||
      address.includes(query) ||
      email.includes(query) ||
      phone.includes(query)
    );
  });

  const handleAddCenter = () => {
    setModalMode('add');
    setSelectedCenter(null);
    setFormData({ name: '', address: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleEditCenter = (center) => {
    setModalMode('edit');
    setSelectedCenter(center);
    setFormData({
      name: center.name || '',
      address: center.address || '',
      email: center.email || '',
      phone: center.phone || ''
    });
    setShowModal(true);
  };

  const handleDeleteCenter = async (center) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trung tâm "${center.name}"?`)) return;
    const centerId = center.centerId || center.id;
    if (!centerId) {
      alert('❌ Không tìm thấy ID của trung tâm!');
      return;
    }
    const result = await deleteCenter(centerId);
    if (result.success) alert('✅ Xóa trung tâm thành công!');
    else alert(`❌ Lỗi: ${result.error}`);
  };

  const handleSaveCenter = async () => {
    if (!formData.name?.trim() || !formData.address?.trim() || !formData.email?.trim() || !formData.phone?.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    let result;
    if (modalMode === 'add') {
      result = await addCenter(formData);
    } else {
      const centerId = selectedCenter?.centerId || selectedCenter?.id;
      if (!centerId) {
        alert('❌ Không tìm thấy ID của trung tâm!');
        return;
      }
      result = await updateCenter(centerId, formData);
    }
    if (result.success) {
      alert('✅ Lưu trung tâm thành công!');
      setShowModal(false);
      setSelectedCenter(null);
    } else {
      alert(`❌ Lỗi: ${result.error}`);
    }
  };

  return (
    <div className="centers-section">
      <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2><FaWarehouse style={{marginRight: '8px'}} /> Quản lý trung tâm</h2>
          <p style={{color: '#666', margin: '4px 0 0'}}>Tổng: {centers.length} trung tâm</p>
        </div>
        <button onClick={handleAddCenter} style={{padding: '12px 24px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer'}}>
          <FaPlus /> Thêm trung tâm
        </button>
      </div>
      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
        <div style={{flex: 1, position: 'relative'}}>
          <FaSearch style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
          <input type="text" placeholder="Tìm kiếm trung tâm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px'}} />
        </div>
      </div>
      {error && <div style={{padding: '16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px'}}>❌ {error}</div>}
      <div className="centers-table" style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        {filteredCenters.length === 0 ? (
          <div style={{padding: '60px 20px', textAlign: 'center', color: '#999'}}>
            <FaWarehouse size={48} style={{marginBottom: '16px', opacity: 0.3}} />
            <p>Không tìm thấy trung tâm nào</p>
          </div>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
              <tr>
                <th style={{padding: '16px'}}>STT</th>
                <th style={{padding: '16px'}}>Tên trung tâm</th>
                <th style={{padding: '16px'}}>Địa chỉ</th>
                <th style={{padding: '16px'}}>Email</th>
                <th style={{padding: '16px'}}>Số điện thoại</th>
                <th style={{padding: '16px', textAlign: 'center'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCenters.map((center, idx) => {
                const centerId = center.centerId || center.id;
                return (
                  <tr key={centerId || idx} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '16px'}}>{idx + 1}</td>
                    <td style={{padding: '16px'}}><strong>{center.name || 'N/A'}</strong></td>
                    <td style={{padding: '16px'}}>{center.address || 'N/A'}</td>
                    <td style={{padding: '16px'}}>{center.email || 'N/A'}</td>
                    <td style={{padding: '16px'}}>{center.phone || 'N/A'}</td>
                    <td style={{padding: '16px', textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                        <button onClick={() => handleEditCenter(center)} style={{padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}} title="Chỉnh sửa"><FaEdit /> Sửa</button>
                        <button onClick={() => handleDeleteCenter(center)} style={{padding: '8px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}} title="Xóa"><FaTrash /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '500px', padding: '32px'}}>
            <h2 style={{marginBottom: '24px'}}>{modalMode === 'add' ? '➕ Thêm trung tâm mới' : '✏️ Chỉnh sửa trung tâm'}</h2>
            <div className="form-group">
              <label>Tên trung tâm</label>
              <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input type="text" value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Email <span style={{color: 'red'}}>*</span></label>
              <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} placeholder="center@example.com" />
            </div>
            <div className="form-group">
              <label>Số điện thoại <span style={{color: 'red'}}>*</span></label>
              <input type="text" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} placeholder="0123456789" />
            </div>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
              <button type="button" onClick={() => setShowModal(false)} style={{padding: '12px 24px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>Hủy</button>
              <button type="button" onClick={handleSaveCenter} style={{padding: '12px 24px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'}}>{modalMode === 'add' ? '➕ Thêm' : '💾 Lưu'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
