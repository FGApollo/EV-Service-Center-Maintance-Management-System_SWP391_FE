import React from "react";

const statusBadgeClass = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "status-completed";
    case "Đang xử lý":
      return "status-processing";
    case "Đã hủy":
      return "status-cancelled";
    default:
      return "";
  }
};

const ProfileHistory = ({ bookingHistory }) => (
  <div className="profile-section">
    <div className="section-header">
      <h2>Lịch sử đặt lịch</h2>
    </div>

    <div className="booking-history">
      {bookingHistory.length > 0 ? (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Ngày đặt</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Giá tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.date}</td>
                  <td>{booking.service}</td>
                  <td>
                    <span
                      className={`status-badge ${statusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="price">{booking.price}</td>
                  <td>
                    <button className="view-detail-btn">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-history">
          <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z" />
          </svg>
          <p>Chưa có lịch sử đặt lịch</p>
        </div>
      )}
    </div>
  </div>
);

export default ProfileHistory;

