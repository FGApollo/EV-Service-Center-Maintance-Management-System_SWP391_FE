import React from 'react';
import { FaTools, FaCalendarWeek, FaWarehouse } from 'react-icons/fa';

export const OverviewTrending = ({ stats }) => {
  return (
    <div className="trending-section">
      {/* Trending Services */}
      <div className="trending-card">
        <div className="card-header">
          <h3><FaTools /> Dịch vụ phổ biến nhất (All Time)</h3>
        </div>
        <div className="card-body">
          {stats.trendingServices.length > 0 ? (
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Dịch vụ</th>
                  <th>Số lần</th>
                </tr>
              </thead>
              <tbody>
                {stats.trendingServices.slice(0, 5).map((item, index) => {
                  let serviceName = 'N/A';
                  let count = 0;
                  
                  if (Array.isArray(item)) {
                    serviceName = item[0] || 'N/A';
                    count = item[1] || 0;
                  } else if (typeof item === 'object') {
                    serviceName = item.key || item.serviceType || item.name || 'N/A';
                    count = item.value || item.count || 0;
                  }
                  
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{serviceName}</td>
                      <td className="count-badge">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-small">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Trending Services Last Month */}
      <div className="trending-card">
        <div className="card-header">
          <h3><FaCalendarWeek /> Dịch vụ phổ biến (Tháng trước)</h3>
        </div>
        <div className="card-body">
          {stats.trendingServicesLastMonth.length > 0 ? (
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Dịch vụ</th>
                  <th>Số lần</th>
                </tr>
              </thead>
              <tbody>
                {stats.trendingServicesLastMonth.slice(0, 5).map((item, index) => {
                  let serviceName = 'N/A';
                  let count = 0;
                  
                  if (Array.isArray(item)) {
                    serviceName = item[0] || 'N/A';
                    count = item[1] || 0;
                  } else if (typeof item === 'object') {
                    serviceName = item.key || item.serviceType || item.name || 'N/A';
                    count = item.value || item.count || 0;
                  }
                  
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{serviceName}</td>
                      <td className="count-badge">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-small">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Parts Used */}
      <div className="trending-card">
        <div className="card-header">
          <h3><FaWarehouse /> Phụ tùng trong kho</h3>
        </div>
        <div className="card-body">
          {Array.isArray(stats.trendingParts) && stats.trendingParts.length > 0 ? (
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Phụ tùng</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {stats.trendingParts.slice(0, 5).map((part, index) => (
                  <tr key={part.id || index}>
                    <td>{index + 1}</td>
                    <td>{part.name || part.partName || 'N/A'}</td>
                    <td className="count-badge">{part.quantityInStock || part.quantity || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-small">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
