import React, { useEffect, useState } from 'react';
import { FaWarehouse, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useCenters } from '../../hooks/useCenters';

export const CentersTab = () => {
  const { centers, loading, error, fetchCenters, addCenter, updateCenter, deleteCenter } = useCenters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', manager: '', phone: '', status: 'ACTIVE' });

  useEffect(() => { fetchCenters(); }, [fetchCenters]);

  // Filter centers
  const filteredCenters = centers.filter(center => {
    return (
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddCenter = () => {
    setModalMode('add');
    setSelectedCenter(null);
    setFormData({ name: '', address: '', manager: '', phone: '', status: 'ACTIVE' });
    setShowModal(true);
  };

  const handleEditCenter = (center) => {
    setModalMode('edit');
    setSelectedCenter(center);
    setFormData({ ...center });
    setShowModal(true);
  };

  const handleDeleteCenter = async (center) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trung tâm "${center.name}"?`)) return;
    const result = await deleteCenter(center.id);
    if (result.success) alert('✅ Xóa trung tâm thành công!');
    else alert(`❌ Lỗi: ${result.error}`);
  };

  const handleSaveCenter = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.manager.trim() || !formData.phone.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    let result;
    if (modalMode === 'add') result = await addCenter(formData);
    else result = await updateCenter(selectedCenter.id, formData);
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
                <th style={{padding: '16px'}}>Quản lý</th>
                <th style={{padding: '16px'}}>Số điện thoại</th>
                <th style={{padding: '16px'}}>Trạng thái</th>
                <th style={{padding: '16px', textAlign: 'center'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCenters.map((center, idx) => (
                <tr key={center.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                  <td style={{padding: '16px'}}>{idx + 1}</td>
                  <td style={{padding: '16px'}}><strong>{center.name}</strong></td>
                  <td style={{padding: '16px'}}>{center.address}</td>
                  <td style={{padding: '16px'}}>{center.manager}</td>
                  <td style={{padding: '16px'}}>{center.phone}</td>
                  <td style={{padding: '16px'}}>
                    <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: center.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2', color: center.status === 'ACTIVE' ? '#065f46' : '#991b1b'}}>{center.status}</span>
                  </td>
                  <td style={{padding: '16px', textAlign: 'center'}}>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                      <button onClick={() => handleEditCenter(center)} style={{padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}} title="Chỉnh sửa"><FaEdit /> Sửa</button>
                      <button onClick={() => handleDeleteCenter(center)} style={{padding: '8px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}} title="Xóa"><FaTrash /> Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
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
              <label>Quản lý</label>
              <input type="text" value={formData.manager} onChange={e => setFormData(f => ({ ...f, manager: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
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
