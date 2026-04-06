import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TreatmentBarChart({ data }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedKey = keys[selectedIndex] || null;
  const selectedData = selectedKey ? data[selectedKey] : [];

  const handleChange = (event) => {
    setSelectedIndex(parseInt(event.target.value));
  };

  return (
    <>
      <div
        className='select-container'
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <label className="topic">Treatment Status</label>
        <select
          className="select"
          value={selectedIndex}
          onChange={handleChange}
          disabled={!isValidData}
        >
          {isValidData ? (
            keys.map((item, index) => (
              <option className="options" key={index} value={index}>
                {item}
              </option>
            ))
          ) : (
            <option disabled>No options available</option>
          )}
        </select>
      </div>
      <br />

      {isValidData ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedData}>
            <XAxis dataKey={selectedKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Yes" stackId="a" fill="#82ca9d" />
            <Bar dataKey="No" stackId="a" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', color: 'gray', fontStyle: 'italic' }}>
          No data available to display.
        </div>
      )}
    </>
  );
}
