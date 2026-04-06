import React, { useEffect, useState } from "react";
// import "./Sidebar.css";

const Sidebar = ({ rows, column, fileName, setPage, setMldata }) => {
  const [storedFiles, setStoredFiles] = useState([]);

  // Load saved files from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("uploadedFiles");
    if (saved) {
      setStoredFiles(JSON.parse(saved));
    }
  }, []);

  // Handle file selection from stored files
  const handleLoadFile = (fileData) => {
    setMldata(fileData.data);
  };

  return (
    <div className="sidebars">
      <div>
        <h2 className="sidebar-title">📄 Session Summary</h2>
        <div className="sidebar-section">
          <p><strong>File: </strong>{!fileName ? 'System File' : fileName}</p>
          <p><strong>Rows: </strong>{rows}</p>
          <p><strong>Columns: </strong>{column}</p>
          <p><strong>Model: </strong>{!fileName ? ' Not Loaded' : ' ✅ Loaded'}</p>
        </div>
      </div>

      <div>
        <h2 className="sidebar-title">📁 Files</h2>
        <div className="sidebar-section">
          <p className="sidebar-sub">System File</p>
          <button onClick={() => setPage(0)}>Load Default</button>
          {storedFiles.length > 0 && (
            <>
              <p className="sidebar-sub">Your Files</p>
              {storedFiles.map((file, index) => (
                <button key={index} onClick={() => handleLoadFile(file)}>
                  {file.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="sidebar-title">⚡ Quick Actions</h2>
        <div className="sidebar-actions">
          <button onClick={() => setPage(1)}>Upload New CSV</button>
          <button onClick={() => setPage(2)}>Check Prediction</button>
          <button onClick={() => setPage(3)}>Talk to Bot</button>
          <button><a href="https://www.ijaresm.com/uploaded_files/document_file/Dr._G_._Arun_Kumar_Qa4A.pdf" target="_blank" download>Download Research Paper</a>
</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
