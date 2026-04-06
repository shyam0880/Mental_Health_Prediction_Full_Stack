import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgeBarChart({ data, title }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;

  const chartData = isValidData
    ? Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value
      }))
    : [];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: 'black'
        }}>
          <p style={{ margin: 0 }}><strong>{label}</strong></p>
          <p style={{ margin: 0 }}>Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const showLabels = chartData.length <= 6;

  return (
    <>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <span className="topic">{title} - Bar Chart</span>
        </Typography>

        {isValidData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
            >
              <XAxis 
                dataKey="name"
                angle={showLabels? 0 : -45}           
                textAnchor="end"      
                // interval={1}          
                dy={10}               
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data available to display.
          </Typography>
        )}
      </CardContent>
    </>
  );
}
