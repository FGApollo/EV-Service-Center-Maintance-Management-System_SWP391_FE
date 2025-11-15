import React from "react";

const getServiceRecommendation = (mileage) => {
  const parsedMileage = parseInt(mileage, 10);
  if (!parsedMileage || Number.isNaN(parsedMileage) || parsedMileage <= 0) {
    return null;
  }

  if (parsedMileage <= 5000) {
    return {
      serviceId: 1,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>Gói Cơ bản</strong>. Gói này phù hợp cho xe mới hoặc xe chạy ít km, bao gồm các kiểm tra cơ bản và bảo dưỡng định kỳ.`,
      color: "#10b981",
    };
  }

  if (parsedMileage > 5000 && parsedMileage < 10000) {
    return {
      serviceId: 1,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), xe của bạn vẫn trong tình trạng tốt. Bạn có thể chọn <strong>Gói Cơ bản</strong> để duy trì hiệu suất hoạt động.`,
      color: "#10b981",
    };
  }

  if (parsedMileage >= 10000 && parsedMileage <= 15000) {
    return {
      serviceId: 2,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>Gói Tiêu chuẩn</strong>. Gói này cung cấp mức độ bảo dưỡng cân bằng, phù hợp cho hầu hết các xe đang sử dụng thường xuyên.`,
      color: "#3b82f6",
    };
  }

  if (parsedMileage >= 15000 && parsedMileage <= 20000) {
    return {
      serviceId: 3,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), chúng tôi khuyến nghị bạn nên chọn <strong>Gói Cao cấp</strong>. Gói này cung cấp bảo dưỡng toàn diện, bao gồm kiểm tra chi tiết và hiệu chỉnh hệ thống quan trọng.`,
      color: "#f59e0b",
    };
  }

  if (parsedMileage > 20000) {
    return {
      serviceId: 3,
      title: "💡 Khuyến nghị cho xe của bạn",
      message: `Với số km hiện tại (<strong>${parsedMileage.toLocaleString()} km</strong>), xe của bạn đã chạy khá nhiều. Chúng tôi <strong>đặc biệt khuyến nghị Gói Cao cấp</strong> để đảm bảo xe được kiểm tra và bảo dưỡng toàn diện nhất.`,
      color: "#f59e0b",
    };
  }

  return null;
};

const BookingServicesStep = ({
  formData,
  services,
  expandedServices,
  toggleServiceDetails,
  handleServiceToggle,
  formatCurrency,
}) => {
  const maintenanceServices = services.filter(
    (service) => service.category === "Bảo dưỡng"
  );
  const recommendation = getServiceRecommendation(formData.mileage);

  return (
    <div className="booking-step-content">
      {recommendation && (
        <div
          className="form-section"
          style={{
            background: `linear-gradient(135deg, ${recommendation.color}15 0%, ${recommendation.color}05 100%)`,
            border: `2px solid ${recommendation.color}`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: recommendation.color,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {recommendation.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#374151",
            }}
            dangerouslySetInnerHTML={{ __html: recommendation.message }}
          />
        </div>
      )}

      <div className="form-section">
        <h2>
          <span className="form-section-icon">🔧</span>
          Bảo dưỡng
        </h2>
        <div className="selection-grid">
          {maintenanceServices.map((service) => {
            const isSelected = formData.selectedServices.includes(service.id);
            const isExpanded = expandedServices.includes(service.id);

            return (
              <div
                key={service.id}
                className={`selection-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="selection-card-header">
                  <span className="selection-card-icon">{service.icon}</span>
                  <input
                    type="checkbox"
                    className="selection-checkbox"
                    checked={isSelected}
                    readOnly
                  />
                </div>
                <h3>{service.name}</h3>
                <div className="selection-card-price">
                  {service.priceText || formatCurrency(service.priceValue)}
                </div>
                {service.summary && (
                  <p className="service-summary">{service.summary}</p>
                )}
                {service.details && isExpanded && (
                  <ul className="service-details-list">
                    {service.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
                <button
                  className="selection-card-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleServiceDetails(service.id);
                  }}
                >
                  {isExpanded ? "Ẩn chi tiết" : "Chi tiết"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingServicesStep;

