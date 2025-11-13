import React from 'react';
import { FaTools, FaCalendarWeek, FaWarehouse } from 'react-icons/fa';
import { AccordionSection } from './Accordion';
import './OverviewTrending.css';

export const OverviewTrending = ({ stats }) => {
  const renderTrendingServiceTable = (services, label) => {
    return (
      <AccordionSection 
        title={label} 
        icon={<FaTools />}
        defaultOpen={true}
        className="trending-accordion"
      >
        {services.length > 0 ? (
          <div className="table-wrapper">
            <table className="trending-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Dịch vụ</th>
                  <th>Số lần</th>
                </tr>
              </thead>
              <tbody>
                {services.slice(0, 5).map((item, index) => {
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
                      <td className="rank">
                        <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                      </td>
                      <td className="service-name">{serviceName}</td>
                      <td className="count-badge">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Chưa có dữ liệu</p>
          </div>
        )}
      </AccordionSection>
    );
  };

  return (
    <div className="trending-section">
      {renderTrendingServiceTable(stats.trendingServices, 'Dịch vụ phổ biến (All Time)')}
      {renderTrendingServiceTable(stats.trendingServicesLastMonth, 'Dịch vụ phổ biến (Tháng trước)')}
      
      <AccordionSection 
        title="Phụ tùng trong kho" 
        icon={<FaWarehouse />}
        defaultOpen={true}
        className="trending-accordion"
      >
        {Array.isArray(stats.trendingParts) && stats.trendingParts.length > 0 ? (
          <div className="table-wrapper">
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
                    <td className="rank">
                      <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                    </td>
                    <td className="part-name">{part.name || part.partName || 'N/A'}</td>
                    <td className="count-badge">{part.quantityInStock || part.quantity || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Chưa có dữ liệu</p>
          </div>
        )}
      </AccordionSection>
    </div>
  );
};
