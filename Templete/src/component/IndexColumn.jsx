// import { useState } from 'react';


// export default function IndexColumn({title, data}) {
//     const keys = Object.keys(data);
//     const selectedData = keys.map((key)=>( data[key]));
//   return (
//     <>
//         <div className='select-container'>
//             <span className="table_topic">{title}</span>
//             <br />
//         </div>
//       <div className="tabledata">
//         <table >
//           <thead>
//             <tr>
//               <th style={{ border: '2px solid #364152', padding: '8px', background:'#2a2f3b' }}>Keys</th>
//               <th style={{ border: '2px solid #364152', padding: '8px', background:'#2a2f3b' }}>Value</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(selectedData).map(([item,value]) => (
//               <tr key={item}>
//                 <td style={{ border: '2px solid #364152', padding: '8px', maxWidth: '180px' }}>{keys[item]}</td>
//                 <td style={{ border: '2px solid #364152', padding: '8px', maxWidth: '180px' }}>{value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

export default function IndexColumn({ title, data }) {
  const isValidData = data && typeof data === 'object' && Object.keys(data).length > 0;
  const keys = isValidData ? Object.keys(data) : [];

  return (
    <>
      <div className='select-container'>
        <span className="table_topic">{title}</span>
        <br />
      </div>
      <div className="tabledata">
        {isValidData ? (
          <table>
            <thead>
              <tr>
                <th style={{ border: '2px solid #364152', padding: '8px', background: '#2a2f3b' }}>Key</th>
                <th style={{ border: '2px solid #364152', padding: '8px', background: '#2a2f3b' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key, index) => (
                <tr key={key}>
                  <td style={{ border: '2px solid #364152', padding: '8px', maxWidth: '180px' }}>{key}</td>
                  <td style={{ border: '2px solid #364152', padding: '8px', maxWidth: '180px' }}>{data[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: 'gray' }}>
            No data available to display.
          </div>
        )}
      </div>
    </>
  );
}
