import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

const ModelBulletChart = ({ data }) => {
  // Convert input to recharts-friendly format
  const chartData = Object.entries(data).map(([model, { accuracy }]) => ({
    model,
    accuracy: parseFloat((accuracy * 100).toFixed(2)),
    target: 90, // example target accuracy
  }));

  const maxAccuracy = Math.max(...chartData.map(item => item.accuracy));

  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Model Accuracy Bullet Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300} >
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid stroke="none" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="model" type="category" />
          <Tooltip />
          <Bar dataKey="accuracy" stroke="none">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.accuracy === maxAccuracy ? '#d60d1e' : '#4caf50'}
              />
            ))}
            <LabelList
              dataKey="accuracy"
              position="right"
              style={{ fill: 'white', fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelBulletChart;
