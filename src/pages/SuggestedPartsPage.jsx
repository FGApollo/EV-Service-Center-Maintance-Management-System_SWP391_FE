import React from "react";
import "./Profile.css";
import "./SuggestedPartsPage.css";
import CustomerSuggestedParts from "../components/mycar/CustomerSuggestedParts";
import MyCarHeader from "../components/mycar/MyCarHeader";

function SuggestedPartsPage({ onNavigate }) {
  return (
    <div className="profile-container">
      <MyCarHeader onBack={() => onNavigate("home")} />
      <div className="suggested-parts-page-content">
        <div className="suggested-parts-page-main">
          <div className="suggested-parts-page-header">
            <h2 className="suggested-parts-page-title">Linh kiện cần thay thế</h2>
            <p className="suggested-parts-page-description">
              Kỹ thuật viên đã đề xuất các linh kiện cần thay thế cho xe của bạn. 
              Vui lòng xem xét và phản hồi từng linh kiện.
            </p>
          </div>
          <CustomerSuggestedParts isOpen={true} />
        </div>
      </div>
    </div>
  );
}

export default SuggestedPartsPage;

