// import { useState } from 'react';


// export default function Overview({data}) {
//   const keys = Object.keys(data);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const selectedKey = keys[selectedIndex];
//   const selectedData = data[selectedKey];

//   const handleChange = (event) => {
//     setSelectedIndex(event.target.value);
//   };

//   return (
//     <>
//       <div className='select-container'>
//         <label className="select-label">Unique Data in each Column:</label>
//         <br/>
//         <select className="select"
//           value={selectedIndex}
//           onChange={handleChange}
//           >
//         {keys.map((item,index) => 
//         ( <option className="options" key={index} value={index}>{item}</option>))}
//         </select>
//       </div>
//       <div className="tabledata">
//         <table style={{height:'100%', width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={{ border: '1px solid black', padding: '8px', background:'#2a2f3b' }}>Key</th>
//               <th style={{ border: '1px solid black', padding: '8px', background:'#2a2f3b' }}>Value</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(selectedData).map(([key, value]) => (
//               <tr key={key}>
//                 <td style={{ border: '1px solid black', padding: '8px' }}>{key}</td>
//                 <td style={{ border: '1px solid black', padding: '8px' }}>{value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

import { useState } from 'react';

export default function Overview({ data }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKey = keys[selectedIndex] || '';
  const selectedData = selectedKey ? data[selectedKey] : {};

  const handleChange = (event) => {
    setSelectedIndex(parseInt(event.target.value));
  };

  return (
    <>
      <div className='select-container'>
        <label className="select-label">Unique Data in each Column:</label>
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
          <table style={{ height: '100%', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px', background: '#2a2f3b' }}>Key</th>
                <th style={{ border: '1px solid black', padding: '8px', background: '#2a2f3b' }}>Value</th>
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
