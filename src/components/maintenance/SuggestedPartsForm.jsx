import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimesCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { getAllParts, submitSuggestedParts } from '../../api';
import { showSuccess, showError } from '../../utils/toast';
import './SuggestedPartsForm.css';

/**
 * Component để technician gửi danh sách linh kiện cần thay thế thêm
 * Sau khi hoàn thành checklist, technician có thể đề xuất các linh kiện cần thay thế
 */
const SuggestedPartsForm = ({ appointmentId, vehicleModel, onSuccess }) => {
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [suggestedParts, setSuggestedParts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load parts list
  useEffect(() => {
    const loadParts = async () => {
      try {
        setPartsLoading(true);
        const data = await getAllParts();
        setParts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách linh kiện:', err);
        setParts([]);
      } finally {
        setPartsLoading(false);
      }
    };
    
    loadParts();
  }, []);

  // Extract model from vehicle model string (e.g., "Loin Model A" -> "Model A")
  const extractModelFromVehicle = (vehicleModel) => {
    if (!vehicleModel) return null;
    const modelMatch = vehicleModel.match(/Model\s+[A-Z]/i);
    if (modelMatch) {
      return modelMatch[0].trim();
    }
    return null;
  };

  // Filter parts by vehicle model if available
  const filteredParts = React.useMemo(() => {
    if (!vehicleModel) return parts;
    
    const modelKey = extractModelFromVehicle(vehicleModel);
    if (!modelKey) return parts;
    
    const filtered = parts.filter(part => {
      const partName = (part.name || '').toLowerCase();
      const partDesc = (part.description || '').toLowerCase();
      const modelLower = modelKey.toLowerCase();
      
      return partName.includes(modelLower) || partDesc.includes(modelLower);
    });
    
    // If no parts match, return all parts
    return filtered.length > 0 ? filtered : parts;
  }, [parts, vehicleModel]);

  const handleAddSuggestedPart = () => {
    setSuggestedParts([
      ...suggestedParts,
      {
        partId: '',
        quantity: 1,
        technicianNote: ''
      }
    ]);
  };

  const handleRemoveSuggestedPart = (index) => {
    setSuggestedParts(suggestedParts.filter((_, i) => i !== index));
  };

  const handleUpdateSuggestedPart = (index, field, value) => {
    const updated = [...suggestedParts];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setSuggestedParts(updated);
  };

  const handleSubmit = async () => {
    // Validate
    if (suggestedParts.length === 0) {
      showError('Vui lòng thêm ít nhất một linh kiện cần thay thế');
      return;
    }

    // Validate each part
    for (let i = 0; i < suggestedParts.length; i++) {
      const part = suggestedParts[i];
      if (!part.partId || part.partId === '') {
        showError(`Vui lòng chọn linh kiện cho mục ${i + 1}`);
        return;
      }
      if (!part.quantity || part.quantity <= 0) {
        showError(`Vui lòng nhập số lượng hợp lệ cho mục ${i + 1}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Format data for API
      const submitData = suggestedParts.map(part => ({
        appointmentId: parseInt(appointmentId),
        partId: parseInt(part.partId),
        quantity: parseInt(part.quantity),
        technicianNote: part.technicianNote || ''
      }));

      console.log('📤 Submitting suggested parts:', submitData);
      const response = await submitSuggestedParts(submitData);
      console.log('✅ Suggested parts submitted:', response);

      showSuccess('Đã gửi danh sách linh kiện cần thay thế thành công!');
      
      // Reset form
      setSuggestedParts([]);
      setShowForm(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi suggested parts:', err);
      showError(err.response?.data?.message || 'Không thể gửi danh sách linh kiện. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!appointmentId) {
    return null;
  }

  return (
    <div className="suggested-parts-form-container">
      <div className="suggested-parts-header">
        <h3>Đề xuất linh kiện cần thay thế</h3>
        <p className="suggested-parts-description">
          Sau khi hoàn thành checklist, bạn có thể đề xuất các linh kiện cần thay thế thêm cho xe.
        </p>
        <button
          type="button"
          className="toggle-suggested-parts-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Ẩn form' : 'Thêm đề xuất linh kiện'}
        </button>
      </div>

      {showForm && (
        <div className="suggested-parts-form">
          {/* List of suggested parts */}
          {suggestedParts.length > 0 && (
            <div className="suggested-parts-list">
              {suggestedParts.map((suggestedPart, index) => {
                const selectedPart = parts.find(p => p.id === parseInt(suggestedPart.partId));
                
                return (
                  <div key={index} className="suggested-part-item">
                    <div className="suggested-part-header">
                      <span className="suggested-part-number">#{index + 1}</span>
                      <button
                        type="button"
                        className="remove-suggested-part-btn"
                        onClick={() => handleRemoveSuggestedPart(index)}
                        title="Xóa"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>

                    <div className="suggested-part-fields">
                      {/* Part Selection */}
                      <div className="suggested-part-field">
                        <label>Linh kiện *</label>
                        {partsLoading ? (
                          <div className="loading-select">
                            <FaSpinner className="spinner" />
                            <span>Đang tải...</span>
                          </div>
                        ) : (
                          <select
                            value={suggestedPart.partId}
                            onChange={(e) => handleUpdateSuggestedPart(index, 'partId', e.target.value)}
                            className="suggested-part-select"
                          >
                            <option value="">Chọn linh kiện...</option>
                            {filteredParts.map(part => {
                              const partPrice = part.unitPrice || part.unit_price || part.price || 0;
                              return (
                                <option key={part.id} value={part.id}>
                                  {part.name || `Part ${part.id}`} 
                                  {partPrice > 0 ? ` - ${partPrice.toLocaleString('vi-VN')} VNĐ` : ''}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="suggested-part-field">
                        <label>Số lượng *</label>
                        <input
                          type="number"
                          min="1"
                          value={suggestedPart.quantity}
                          onChange={(e) => handleUpdateSuggestedPart(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="suggested-part-quantity"
                        />
                      </div>

                      {/* Technician Note */}
                      <div className="suggested-part-field full-width">
                        <label>Ghi chú kỹ thuật viên</label>
                        <textarea
                          value={suggestedPart.technicianNote}
                          onChange={(e) => handleUpdateSuggestedPart(index, 'technicianNote', e.target.value)}
                          placeholder="Nhập ghi chú về lý do cần thay thế linh kiện này..."
                          className="suggested-part-note"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Part Button */}
          <div className="suggested-parts-actions">
            <button
              type="button"
              className="add-suggested-part-btn"
              onClick={handleAddSuggestedPart}
            >
              <FaPlus />
              Thêm linh kiện
            </button>
          </div>

          {/* Submit Button */}
          {suggestedParts.length > 0 && (
            <div className="suggested-parts-submit">
              <button
                type="button"
                className="submit-suggested-parts-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spinner" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Gửi đề xuất linh kiện
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {suggestedParts.length === 0 && (
            <div className="suggested-parts-empty">
              <p>Chưa có linh kiện nào được đề xuất. Nhấn "Thêm linh kiện" để bắt đầu.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestedPartsForm;

