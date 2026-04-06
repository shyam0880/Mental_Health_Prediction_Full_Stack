import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC', '#FF4444'];

export default function GenderPieChart({ data, title }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;

  const pieData = isValidData
    ? Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value
      }))
    : [];

  const showLabels = pieData.length <= 6;

  return (
    <>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <span className="topic">{title} - Pie Chart</span>
        </Typography>

        {isValidData ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={
                  showLabels
                    ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`
                    : false
                }
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLabels && <Legend />}
            </PieChart>
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
