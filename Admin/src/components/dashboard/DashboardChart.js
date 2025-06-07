import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = ({ 
  type, 
  labels, 
  data, 
  label, 
  borderColor,
  backgroundColor
}) => {
  // Line chart config
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: label || 'Data',
        data,
        borderColor,
        backgroundColor,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Bar chart config
  const barData = {
    labels,
    datasets: [
      {
        label: label || 'Data',
        data,
        backgroundColor: Array.isArray(backgroundColor) 
          ? backgroundColor 
          : borderColor || '#3B82F6',
      },
    ],
  };

  // Doughnut chart config
  const doughnutData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: Array.isArray(backgroundColor) 
          ? backgroundColor 
          : [
              '#3B82F6', // Blue
              '#10B981', // Green
              '#F59E0B', // Amber
              '#EF4444', // Red
              '#8B5CF6', // Purple
            ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    maintainAspectRatio: false,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line options={lineOptions} data={lineData} height={300} />;
      case 'bar':
        return <Bar options={lineOptions} data={barData} height={300} />;
      case 'doughnut':
        return <Doughnut options={doughnutOptions} data={doughnutData} height={300} />;
      default:
        return <Line options={lineOptions} data={lineData} height={300} />;
    }
  };

  return (
    <div style={{ height: '300px' }}>
      {renderChart()}
    </div>
  );
};

export default DashboardChart;