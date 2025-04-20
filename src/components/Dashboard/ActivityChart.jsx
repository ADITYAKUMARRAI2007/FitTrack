import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ActivityChart({ data, dataKey, barColor = "#0077ED" }) {
  const [chartData, setChartData] = useState([]);
  const [activeBar, setActiveBar] = useState(null);
  
  useEffect(() => {
    // Initially show no data
    setChartData([]);
    
    // Animate data loading
    const timer = setTimeout(() => {
      setChartData(data);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  const handleMouseEnter = (data, index) => {
    setActiveBar(index);
  };
  
  const handleMouseLeave = () => {
    setActiveBar(null);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-primary">
            {payload[0].value} {payload[0].unit || ''}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-64 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar 
            dataKey={dataKey}
            fill={barColor}
            radius={[4, 4, 0, 0]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityChart;