import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTimesCircle, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { getAllParts } from '../../api';
import './PartsUsedSection.css';

// Extract model from vehicle model string (e.g., "Loin Model A" -> "Model A")
const extractModelFromVehicle = (vehicleModel) => {
  if (!vehicleModel) return null;
  // Tìm "Model A", "Model B", "Model C" trong tên xe
  const modelMatch = vehicleModel.match(/Model\s+[A-Z]/i);
  if (modelMatch) {
    return modelMatch[0].trim(); // "Model A", "Model B", "Model C"
  }
  return null;
};

const PartsUsedSection = ({
  partsUsed = [],
  onPartsChange,
  vehicleModel = null,
  onSave = null,
  actionLoading = false
}) => {
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [showPartsSelector, setShowPartsSelector] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQuantity, setPartQuantity] = useState(1);

  // Load parts list và filter theo vehicle model
  useEffect(() => {
    const loadParts = async () => {
      try {
        setPartsLoading(true);
        const data = await getAllParts();
        let allParts = Array.isArray(data) ? data : [];
        
        // Filter parts theo vehicle model nếu có
        if (vehicleModel) {
          const modelKey = extractModelFromVehicle(vehicleModel);
          if (modelKey) {
            console.log('🔍 [PartsUsedSection] Filtering parts by vehicle model:', modelKey);
            allParts = allParts.filter(part => {
              const partName = (part.name || '').toLowerCase();
              const partDesc = (part.description || '').toLowerCase();
              const modelLower = modelKey.toLowerCase();
              
              const matches = partName.includes(modelLower) || partDesc.includes(modelLower);
              
              if (matches) {
                console.log('✅ [PartsUsedSection] Part matches:', part.name);
              }
              
              return matches;
            });
            
            console.log(`🔍 [PartsUsedSection] Filtered parts: ${allParts.length} parts match ${modelKey}`);
            
            // Nếu không có part nào match, hiển thị tất cả (fallback)
            if (allParts.length === 0) {
              console.warn('⚠️ [PartsUsedSection] No parts match vehicle model, showing all parts');
              allParts = Array.isArray(data) ? data : [];
            }
          }
        }
        
        setParts(allParts);
        console.log('✅ [PartsUsedSection] Loaded parts:', allParts.length);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách linh kiện:', err);
        setParts([]);
      } finally {
        setPartsLoading(false);
      }
    };

    if (showPartsSelector) {
      loadParts();
    }
  }, [showPartsSelector, vehicleModel]);

  const handleAddPart = () => {
    if (!selectedPartId || partQuantity <= 0) {
      return;
    }
    
    const part = parts.find(p => p.id === parseInt(selectedPartId));
    if (!part) return;
    
    // Lấy giá tiền từ part data - sử dụng unitPrice (từ API)
    const partPrice = parseFloat(part.unitPrice) || parseFloat(part.unit_price) || parseFloat(part.price) || parseFloat(part.unitCost) || parseFloat(part.cost) || 0;
    
    const newPartsUsed = [...partsUsed];
    const existingIndex = newPartsUsed.findIndex(p => p.partId === parseInt(selectedPartId));
    
    if (existingIndex >= 0) {
      // Update quantity and ensure unitCost is set correctly
      newPartsUsed[existingIndex].quantityUsed = parseInt(partQuantity);
      // Đảm bảo unitCost được cập nhật từ part data nếu chưa có hoặc cần cập nhật
      if (!newPartsUsed[existingIndex].unitCost || newPartsUsed[existingIndex].unitCost === 0) {
        newPartsUsed[existingIndex].unitCost = partPrice;
      }
    } else {
      // Add new part với giá tiền tự động
      newPartsUsed.push({
        partId: parseInt(selectedPartId),
        partName: part.name || `Part ${selectedPartId}`,
        quantityUsed: parseInt(partQuantity),
        unitCost: partPrice // Tự động fill giá tiền từ part data
      });
    }
    
    console.log('✅ Added part with auto-filled price:', {
      partId: parseInt(selectedPartId),
      partName: part.name,
      quantity: parseInt(partQuantity),
      unitCost: partPrice
    });
    
    onPartsChange(newPartsUsed);
    setSelectedPartId('');
    setPartQuantity(1);
  };

  const handleRemovePart = (partId) => {
    const newPartsUsed = partsUsed.filter(p => p.partId !== partId);
    onPartsChange(newPartsUsed);
  };

  const handleUpdatePartQuantity = (partId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemovePart(partId);
      return;
    }
    
    const newPartsUsed = partsUsed.map(part => 
      part.partId === partId 
        ? { ...part, quantityUsed: parseInt(newQuantity) || 1 }
        : part
    );
    onPartsChange(newPartsUsed);
  };

  // Calculate total cost
  const totalCost = partsUsed.reduce((sum, part) => {
    return sum + ((part.unitCost || 0) * (part.quantityUsed || 0));
  }, 0);

  return (
    <div className="parts-used-section">
      <div className="parts-used-header">
        <h3>Linh kiện đã sử dụng</h3>
        <button
          type="button"
          className="toggle-parts-btn"
          onClick={() => setShowPartsSelector(!showPartsSelector)}
        >
          <FaPlus />
          {showPartsSelector ? 'Ẩn' : 'Thêm'} linh kiện
        </button>
      </div>

      {/* Selected Parts List */}
      {partsUsed.length > 0 ? (
        <div className="selected-parts-list">
          {partsUsed.map((part, index) => (
            <div key={index} className="selected-part-item">
              <div className="part-info-group">
                <span className="part-name">
                  {part.partName || `Part ID: ${part.partId}`}
                </span>
                <div className="part-details">
                  <div className="part-quantity-control">
                    <label className="part-quantity-label">Số lượng:</label>
                    <input
                      type="number"
                      className="part-quantity-edit"
                      min="1"
                      value={part.quantityUsed}
                      onChange={(e) => handleUpdatePartQuantity(part.partId, e.target.value)}
                    />
                  </div>
                  <div className="part-price-display">
                    <span className="part-price-label">Đơn giá:</span>
                    <span className="part-price-value">
                      {part.unitCost ? `${part.unitCost.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                    </span>
                  </div>
                  <div className="part-total-display">
                    <span className="part-total-label">Thành tiền:</span>
                    <span className="part-total-value">
                      {((part.unitCost || 0) * (part.quantityUsed || 0)).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="remove-part-btn"
                onClick={() => handleRemovePart(part.partId)}
                title="Xóa linh kiện"
              >
                <FaTimesCircle />
              </button>
            </div>
          ))}
          
          {/* Total Cost */}
          <div className="parts-total-cost">
            <span className="total-label">Tổng cộng:</span>
            <span className="total-value">{totalCost.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>
      ) : (
        <div className="no-parts-message">
          <p>Chưa có linh kiện nào được thêm</p>
        </div>
      )}

      {/* Parts Selector Form */}
      {showPartsSelector && (
        <div className="parts-selector-form">
          {partsLoading ? (
            <div className="parts-loading">
              <FaSpinner className="spinner" />
              <span>Đang tải danh sách linh kiện...</span>
            </div>
          ) : (
            <div className="parts-selector-inputs">
              <select
                className="part-select"
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
              >
                <option value="">Chọn linh kiện...</option>
                {parts.map(part => {
                  // Lấy giá tiền từ unitPrice (từ API)
                  const partPrice = part.unitPrice || part.unit_price || part.price || part.unitCost || part.cost || 0;
                  return (
                    <option key={part.id} value={part.id}>
                      {part.name || `Part ${part.id}`} - {partPrice > 0 ? `${partPrice.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                    </option>
                  );
                })}
              </select>
              
              <input
                type="number"
                className="part-quantity-input"
                placeholder="Số lượng"
                min="1"
                value={partQuantity}
                onChange={(e) => setPartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              
              <button
                type="button"
                className="add-part-btn"
                onClick={handleAddPart}
                disabled={!selectedPartId || partQuantity <= 0}
              >
                <FaPlus />
                Thêm
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      {onSave && (
        <div className="parts-save-section">
          <button
            type="button"
            className="btn-save-maintenance"
            onClick={onSave}
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
        </div>
      )}
    </div>
  );
};

export default PartsUsedSection;

