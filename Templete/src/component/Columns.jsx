import { useState } from 'react';

export default function Columns({ data }) {
  const isValidData = Array.isArray(data) && data.length > 0;

  return (
    <>
      <div className='select-container'>
        <span className="table_topic">Columns</span>
        <br />
      </div>

      <div className="tabledata" style={{ overflowX: 'hidden', height: '410px' }}>
        {isValidData ? (
          <table>
            <thead>
              <tr>
                <th style={{ border: '2px solid #364152', padding: '8px', background: '#2a2f3b' }}>SNo</th>
                <th style={{ border: '2px solid #364152', padding: '8px', background: '#2a2f3b' }}>Columns</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item}>
                  <td style={{ border: '2px solid #364152' }}>{index + 1}</td>
                  <td style={{ border: '2px solid #364152' }}>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'gray', fontStyle: 'italic' }}>
            No columns available to display.
          </div>
        )}
      </div>
    </>
  );
}
