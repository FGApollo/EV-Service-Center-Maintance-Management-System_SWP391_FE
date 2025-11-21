import React, { useMemo } from "react";
import "./BookingServicesStep.css";
import { FaTools, FaCheckCircle, FaClock, FaTimesCircle, FaChevronDown, FaMoneyBillWave, FaSpinner } from "react-icons/fa";

// Map service icon based on name or ID
const getServiceIcon = (service) => {
  const name = (service.name || '').toLowerCase();
  if (name.includes('cơ bản') || name.includes('basic')) {
    return '🛠️';
  } else if (name.includes('tiêu chuẩn') || name.includes('standard')) {
    return '⚡';
  } else if (name.includes('cao cấp') || name.includes('premium') || name.includes('full')) {
    return '✨';
  }
  return '🔧';
};

// Parse description from API (could be string or array)
const parseDescription = (description) => {
  if (!description) return [];
  
  if (Array.isArray(description)) {
    return description;
  }
  
  if (typeof description === 'string') {
    // Split by newlines and filter empty lines
    return description.split('\n').filter(line => line.trim() !== '');
  }
  
  return [];
};

const getServiceRecommendation = (mileage, services) => {
  const parsedMileage = parseInt(mileage, 10);
  if (!parsedMileage || Number.isNaN(parsedMileage) || parsedMileage <= 0 || !services || services.length === 0) {
    return null;
  }

  // Sort services by price (ascending)
  const sortedServices = [...services].sort((a, b) => (a.price || 0) - (b.price || 0));
  const basicService = sortedServices[0];
  const standardService = sortedServices[1] || sortedServices[0];
  const premiumService = sortedServices[sortedServices.length - 1];

  if (parsedMileage <= 5000) {
    return {
      serviceId: basicService?.id,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>${basicService?.name || 'Gói Cơ bản'}</strong>. Gói này phù hợp cho xe mới hoặc xe chạy ít km, bao gồm các kiểm tra cơ bản và bảo dưỡng định kỳ.`,
      color: "#10b981",
    };
  }

  if (parsedMileage > 5000 && parsedMileage < 10000) {
    return {
      serviceId: basicService?.id,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), xe của bạn vẫn trong tình trạng tốt. Bạn có thể chọn <strong>${basicService?.name || 'Gói Cơ bản'}</strong> để duy trì hiệu suất hoạt động.`,
      color: "#10b981",
    };
  }

  if (parsedMileage >= 10000 && parsedMileage <= 15000) {
    return {
      serviceId: standardService?.id,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>${standardService?.name || 'Gói Tiêu chuẩn'}</strong>. Gói này cung cấp mức độ bảo dưỡng cân bằng, phù hợp cho hầu hết các xe đang sử dụng thường xuyên.`,
      color: "#3b82f6",
    };
  }

  if (parsedMileage >= 15000 && parsedMileage <= 20000) {
    return {
      serviceId: premiumService?.id,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>${premiumService?.name || 'Gói Cao cấp'}</strong>. Gói này cung cấp bảo dưỡng toàn diện, bao gồm kiểm tra chi tiết và hiệu chỉnh hệ thống quan trọng.`,
      color: "#f59e0b",
    };
  }

  if (parsedMileage > 20000) {
    return {
      serviceId: premiumService?.id,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), xe của bạn đã chạy khá nhiều. Chúng tôi <strong>đặc biệt khuyến nghị ${premiumService?.name || 'Gói Cao cấp'}</strong> để đảm bảo xe được kiểm tra và bảo dưỡng toàn diện nhất.`,
      color: "#f59e0b",
    };
  }

  return null;
};

const BookingServicesStep = ({
  formData,
  services,
  servicesLoading,
  servicesError,
  expandedServices,
  toggleServiceDetails,
  handleServiceToggle,
  formatCurrency,
}) => {
  // Transform API data to match component format
  const transformedServices = useMemo(() => {
    if (!services || !Array.isArray(services)) return [];
    
    return services.map((service) => ({
      id: service.id,
      name: service.name || 'Dịch vụ không tên',
      description: parseDescription(service.description),
      price: service.price || 0,
      durationEst: service.durationEst || 0,
      icon: getServiceIcon(service),
      // Use description as summary if available
      summary: service.description && typeof service.description === 'string' 
        ? service.description.split('\n')[0].substring(0, 150) + (service.description.length > 150 ? '...' : '')
        : null,
      // Use description as details
      details: parseDescription(service.description),
    }));
  }, [services]);

  const recommendation = useMemo(() => getServiceRecommendation(formData.mileage, transformedServices), [formData.mileage, transformedServices]);

  // Loading State
  if (servicesLoading) {
    return (
      <div className="booking-services-step">
        <div className="services-loading">
          <div className="services-loading-spinner" />
          <p className="services-loading-text">Đang tải danh sách gói dịch vụ...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (servicesError) {
    return (
      <div className="booking-services-step">
        <div className="services-error">
          <div className="services-error-icon">❌</div>
          <p className="services-error-message">{servicesError}</p>
          <button 
            className="services-error-retry"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!transformedServices || transformedServices.length === 0) {
    return (
      <div className="booking-services-step">
        <div className="services-empty">
          <div className="services-empty-icon">🔧</div>
          <p className="services-empty-text">Hiện tại không có gói dịch vụ nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-services-step">
      {recommendation && (
        <div
          className="service-recommendation"
          style={{
            background: `linear-gradient(135deg, ${recommendation.color}15 0%, ${recommendation.color}05 100%)`,
            borderColor: recommendation.color,
          }}
        >
          <h3>{recommendation.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: recommendation.message }} />
        </div>
      )}

      <div className="form-section">
        <h2>
          <span className="form-section-icon">🔧</span>
          Bảo dưỡng
        </h2>
        <div className="services-grid">
          {transformedServices.map((service) => {
            const isSelected = formData.selectedServices.includes(service.id);
            const isExpanded = expandedServices.includes(service.id);

            return (
              <div
                key={service.id}
                className={`service-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="service-card-header">
                  <span className="service-card-icon">{service.icon}</span>
                  <input
                    type="checkbox"
                    className="service-card-checkbox"
                    checked={isSelected}
                    readOnly
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <h3 className="service-card-title">{service.name}</h3>
                <div className="service-card-price">
                  <FaMoneyBillWave className="service-card-price-icon" />
                  <span>{formatCurrency(service.price)}</span>
                </div>
                {service.summary && (
                  <p className="service-card-summary">{service.summary}</p>
                )}
                {service.details && service.details.length > 0 && isExpanded && (
                  <div className="service-details-container">
                    {service.details.map((detail, idx) => {
                      const trimmedDetail = detail.trim();
                      
                      if (trimmedDetail === '') {
                        return <div key={idx} className="service-detail-spacer" />;
                      }
                      
                      // Check if it's a section title (starts with number and dot)
                      if (/^\d+\.\s/.test(trimmedDetail)) {
                        return (
                          <div key={idx} className="service-detail-section-title">
                            {trimmedDetail}
                          </div>
                        );
                      }
                      
                      // Check if it's a sub-item (starts with bullet)
                      if (trimmedDetail.startsWith('•') || trimmedDetail.startsWith('*')) {
                        return (
                          <div key={idx} className="service-detail-item">
                            <span className="service-detail-bullet">•</span>
                            <span className="service-detail-text">{trimmedDetail.replace(/^[•*]\s*/, '')}</span>
                          </div>
                        );
                      }
                      
                      // Regular item
                      return (
                        <div key={idx} className="service-detail-item">
                          <span className="service-detail-text">{trimmedDetail}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {service.details && service.details.length > 0 && (
                  <button
                    className="service-card-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleServiceDetails(service.id);
                    }}
                  >
                    {isExpanded ? "Ẩn chi tiết" : "Chi tiết"}
                    <FaChevronDown className={`details-arrow ${isExpanded ? 'expanded' : ''}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingServicesStep;

