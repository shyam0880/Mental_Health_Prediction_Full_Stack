import { useState, useContext } from 'react'
import './App.css'
import DataQualityTable from './component/DataQualityTable';
import Overview from './component/Overview';
import GenderPieChart from './component/GenderPieChart';
import AgeBarChart from './component/AgeBarChart';
import Columns from './component/Columns';
import IndexColumn from './component/IndexColumn';
import MentalHealthSurveyForm from './component/MentalHealthSurveyForm';
import UniqueDataChange from './component/UniqueDataChange';
import TreatmentBarChart from './component/TreatmentBarChart';
// import Chatbot from './component/ChatBot';
import Sidebar from './component/Sidebar';
import { DataContext } from './contexts/DataContext';
import ModelSidebar from './component/ModelSidebar';
import Botpress from './component/Botpress';

function App() {
  const {mldata, setMldata} = useContext(DataContext);
  const [page, setPage] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedColumnData, setSelectedColumnData] = useState({});
  const [graphStatus, setGraphStatus] = useState(false);
  const [fileName, setFileName] = useState('');
  
  // const [mldata, setMldata] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
  };

  const handleUpload = async () => {
    if (!fileName) return alert('No file selected');
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload_csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMldata(result);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };
    // Safe access to mldata properties
    const valueCounts = mldata?.value_counts ?? {};
    const overviewColumns = mldata?.overview?.each_columns ?? [];
    const overviewUnique = mldata?.overview?.each_unique ?? {};
    const overviewNull = mldata?.overview?.null_count ?? {};
    const chartsData = mldata?.charts ?? {};
    const rows = mldata?.shape?.[0] ?? 0;
    const columnsCount = mldata?.shape?.[1] ?? 0;
    const duplicates = mldata?.duplicates ?? 0;

  return (
    <>
      <div className="dashboard">
        <div className="sidebar">
          <Sidebar  rows={rows} column ={columnsCount} fileName = {fileName} setPage = {setPage}/>
        </div>
        <div className="mainbar">
          <div className="navbar">
            <div className="side"><span className="topic">Mental Health Prediction Data</span></div>
            <div className={`side ${page === 0 ? 'active' : ''}`} onClick={() => setPage(0)}><i className='bx bxs-bar-chart-alt-2'></i>Visual</div>
            <div className={`side ${page === 1 ? 'active' : ''}`} onClick={() => setPage(1)}>Data</div>
            <div className={`side ${page === 2 ? 'active' : ''}`} onClick={() => setPage(2)}>Check </div>
            <div className={`side ${page === 3 ? 'active' : ''}`} onClick={() => setPage(3)}>Talk <i class='bx bx-conversation'></i></div>
            {/* <div className={`side ${page === 3 ? 'active' : ''}`} onClick={() => setPage(3)}>Treatment</div> */}
          </div>

          <div className="container">
            {page === 0 && (
              <div className="content2">
                <div className="section section1">
                  <UniqueDataChange
                    data={valueCounts}
                    onColumnSelect={(column, data) => {
                      setSelectedColumn(column);
                      setSelectedColumnData(data);
                    }}
                    graphStatus={graphStatus}
                    setGraphStatus={setGraphStatus}
                  />
                </div>
                <div className="section section2">
                  <span className="topic">Values Count</span>
                  <span className="shape">{Object.keys(selectedColumnData).length}</span>
                </div>
                <div className="section section3">
                  <GenderPieChart
                    title={graphStatus ? selectedColumn : 'Gender'}
                    data={graphStatus ? selectedColumnData : valueCounts.Gender || {}}
                  />
                </div>
                <div className="section section4">
                  <AgeBarChart
                    title={graphStatus ? selectedColumn : 'Age'}
                    data={graphStatus ? selectedColumnData : valueCounts.Age || {}}
                  />
                </div>
                <div className="section section5">
                  <TreatmentBarChart data={chartsData} />
                </div>
                <div className="section section6">
                  <ModelSidebar data={mldata.model_results}/>
                </div>
              </div>
            )}

            {page === 1 && (
              <>
                <div className="content">
                  <div className="section section1">
                    <span className="topic">Upload CSV File</span>
                    <div className="upload-container">
                      <label htmlFor="fileUpload" className="upload-label">
                        {fileName.length > 0 ? fileName : "Choose File"}
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        className="upload-input"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={handleUpload}
                        className="upload-button"
                        style={{ border: '0', background: '#6d6d6d89', margin: '5px 5px 5px 10px', cursor: 'pointer', borderRadius: '100%' }}
                        disabled={!fileName}
                        title={!fileName ? "Select a file to upload" : ""}
                      >
                        <i className='bx bx-upload'></i>
                      </button>
                    </div>
                  </div>
                  <div className="section section2">
                    <span className="topic">Rows</span>
                    <span className="shape">{rows}</span>
                  </div>
                  <div className="section section3">
                    <span className="topic">Columns</span>
                    <span className="shape">{columnsCount}</span>
                  </div>
                  <div className="section section4">
                    <span className="topic">Duplicates</span>
                    <span className="shape">{duplicates}</span>
                  </div>
                  <div className="section section5">
                    <span className="topic">Download File</span>
                    <span className="shape">
                      <a href="https://drive.google.com/uc?export=download&id=16u-fR8Ds87iLB3UyJ7mtsNnUWDqlvsqr" download style={{ marginRight: 8 }}>
                        <i className='bx bx-cloud-download'></i>Survey File
                      </a>
                    </span>
                  </div>
                </div>

                <div className="content1">
                  <div className="section section6">
                    <DataQualityTable data={valueCounts} />
                  </div>
                  <div className="section section7">
                    <Columns data={overviewColumns} />
                  </div>
                  <div className="section section8">
                    <IndexColumn title={"Unique Data Count"} data={overviewUnique} />
                  </div>
                  <div className="section section9">
                    <IndexColumn title={"Null Data Count"} data={overviewNull} />
                  </div>
                </div>
              </>
            )}

            {page === 2 && (
              <div className="content3">
                <MentalHealthSurveyForm />
              </div>
            )}

            {page === 3 && (
              <div className="content3">
                {/* <Chatbot /> */}
                <Botpress />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default App