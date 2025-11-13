import React from 'react';
import { FaChartBar, FaChartLine } from 'react-icons/fa';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const OverviewCharts = ({ stats, onRefresh }) => {
  return (
    <div className="charts-section">
      {/* Revenue Chart */}
      <div className="chart-card revenue-chart">
        <div className="chart-header">
          <h3><FaChartBar /> Doanh thu theo tháng</h3>
          <button 
            onClick={onRefresh} 
            className="btn-refresh"
            title="Refresh data"
          >
            🔄
          </button>
        </div>
        <div className="chart-body">
          {Object.keys(stats.revenueData || {}).length > 0 ? (
            <div className="bar-chart">
              {Object.entries(stats.revenueData).map(([month, revenue]) => {
                const revenueValue = Math.abs(typeof revenue === 'number' ? revenue : parseFloat(revenue) || 0);
                const allValues = Object.values(stats.revenueData).map(v => Math.abs(parseFloat(v) || 0));
                const maxRevenue = Math.max(...allValues, 1);
                const height = (revenueValue / maxRevenue) * 100;
                return (
                  <div key={month} className="bar-item">
                    <div className="bar-wrapper">
                      <div 
                        className="bar" 
                        style={{ height: `${height}%` }}
                        title={formatCurrency(revenueValue)}
                      ></div>
                    </div>
                    <div className="bar-label">{String(month)}</div>
                    <div className="bar-value">{formatCurrency(revenueValue)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="chart-empty">
              <FaChartBar size={40} />
              <p>Chưa có dữ liệu doanh thu</p>
            </div>
          )}
        </div>
      </div>

      {/* Profit Chart */}
      <div className="chart-card profit-chart">
        <div className="chart-header">
          <h3><FaChartLine /> Lợi nhuận theo tháng</h3>
        </div>
        <div className="chart-body">
          {Object.keys(stats.profitData || {}).length > 0 ? (
            <div className="bar-chart">
              {Object.entries(stats.profitData).map(([month, profit]) => {
                const profitValue = Math.abs(typeof profit === 'number' ? profit : parseFloat(profit) || 0);
                const allValues = Object.values(stats.profitData).map(v => Math.abs(parseFloat(v) || 0));
                const maxProfit = Math.max(...allValues, 1);
                const height = (profitValue / maxProfit) * 100;
                return (
                  <div key={month} className="bar-item">
                    <div className="bar-wrapper">
                      <div 
                        className="bar bar-profit" 
                        style={{ height: `${height}%` }}
                        title={formatCurrency(profitValue)}
                      ></div>
                    </div>
                    <div className="bar-label">{String(month)}</div>
                    <div className="bar-value">{formatCurrency(profitValue)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="chart-empty">
              <FaChartLine size={40} />
              <p>Chưa có dữ liệu lợi nhuận</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
