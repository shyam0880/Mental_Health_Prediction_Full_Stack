// import { useState, useEffect } from 'react';

// export default function DataQualityTable({ data, graphStatus, setGraphStatus, onColumnSelect }) {
//   const keys = Object.keys(data);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const selectedKey = keys[selectedIndex];
//   const selectedData = data[selectedKey];

//   const [columnName, setColumnName] = useState(selectedKey);

//   const handleChange = (event) => {
//     const index = event.target.value;
//     setSelectedIndex(index);
//     setColumnName(keys[index]);
//     if (onColumnSelect) {
//       onColumnSelect(keys[index], data[keys[index]]);
//     }
//   };

//   useEffect(() => {
//     if (onColumnSelect) {
//       onColumnSelect(selectedKey, selectedData);
//     }
//   }, []);

//   const handleToggle = () => {
//     setGraphStatus(prev => !prev);
//   };

//   return (
//     <>
//       <div className='select-container'>
//           <label className="toggle-switch">
//             <span className="topic" style={{ marginRight: 10 }}>Visuals:</span>
//             <input
//               type="checkbox"
//               checked={graphStatus}
//               onChange={handleToggle}
//             />
//             <div className="toggle-switch-background">
//               <div className="toggle-switch-handle"></div>
//             </div>
//           </label>
//         <br />
//         <select className="select" value={selectedIndex} onChange={handleChange}>
//           {keys.map((item, index) => (
//             <option className="options" key={index} value={index}>
//               {item}
//             </option>
//           ))}
//         </select>
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from 'react';

export default function DataQualityTable({ data, graphStatus, setGraphStatus, onColumnSelect }) {
  const keys = data && typeof data === 'object' ? Object.keys(data) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Safely get selected key and data
  const selectedKey = keys[selectedIndex] || null;
  const selectedData = selectedKey ? data[selectedKey] : null;

  const [columnName, setColumnName] = useState(selectedKey || '');

  const handleChange = (event) => {
    const index = parseInt(event.target.value);
    setSelectedIndex(index);
    const key = keys[index];
    setColumnName(key);
    if (onColumnSelect && key) {
      onColumnSelect(key, data[key]);
    }
  };

  useEffect(() => {
    if (onColumnSelect && selectedKey) {
      onColumnSelect(selectedKey, selectedData);
    }
  }, [selectedKey, selectedData]);

  const handleToggle = () => {
    setGraphStatus(prev => !prev);
  };

  return (
    <>
      <div className='select-container'>
        <label className="toggle-switch">
          <span className="topic" style={{ marginRight: 10 }}>Visuals:</span>
          <input
            type="checkbox"
            checked={graphStatus}
            onChange={handleToggle}
          />
          <div className="toggle-switch-background">
            <div className="toggle-switch-handle"></div>
          </div>
        </label>
        <br />

        <select className="select" value={selectedIndex} onChange={handleChange} disabled={keys.length === 0}>
          {keys.length > 0 ? (
            keys.map((item, index) => (
              <option className="options" key={index} value={index}>
                {item}
              </option>
            ))
          ) : (
            <option className="options" disabled>No columns available</option>
          )}
        </select>
      </div>
    </>
  );
}
