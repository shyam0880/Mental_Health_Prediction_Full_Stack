import { useState } from 'react';

export default function DataQualityTable({ data, status }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKey = keys[selectedIndex] || '';
  const selectedData = selectedKey ? data[selectedKey] : {};

  const [columnName, setColumnName] = useState(selectedKey);

  const handleChange = (event) => {
    const index = parseInt(event.target.value);
    setSelectedIndex(index);
    setColumnName(keys[index]);
  };

  return (
    <>
      <div className='select-container'>
        <span className="topic">Unique Data</span>
        <br />
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
            <option disabled>No columns available</option>
          )}
        </select>
      </div>

      {isValidData ? (
        <div className="tabledata">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px', background: '#2a2f3b', maxWidth: '150px' }}>
                  {columnName}
                </th>
                <th style={{ border: '1px solid black', padding: '8px', background: '#2a2f3b', maxWidth: '150px' }}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(selectedData).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{key}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: 'gray' }}>
          No data available to display.
        </div>
      )}
    </>
  );
}
