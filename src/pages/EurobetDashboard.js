import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";

const columns = [
  { Header: "Nome Utente", accessor: "fullName", Cell: ({value}) => <span className="fw-bold">{value}</span> },
  { Header: "Data Pubblicazione", accessor: "timestamp", Cell: ({value}) => <span className="opacity-50 small">{value || "N/D"}</span> },
  { Header: "Contenuto Post", accessor: "caption", Cell: ({value}) => <div className="text-truncate" style={{maxWidth: '400px'}}>{value}</div> },
  { Header: "Link Post", accessor: "url", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>VEDI SU IG</a> },
];

function EurobetDashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.s3BaseUrl}${config.eurobetDataPath}`);
        if (!response.ok) throw new Error('Data not found on S3');
        const jsonData = await response.data || await response.json();
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        console.warn("Using local fallback or empty data:", e);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const tableData = useMemo(() => data, [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: tableData });

  const handleExportExcel = () => {
    // Genera una tabella HTML che Excel può interpretare come foglio di calcolo
    const tableHeader = "<tr><th>ID</th><th>Utente</th><th>Data Pubblicazione</th><th>Didascalia</th><th>URL</th></tr>";
    const tableRows = data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.fullName}</td>
        <td>${p.timestamp || "N/D"}</td>
        <td>${(p.caption || "").replace(/\n/g, " ")}</td>
        <td>${p.url}</td>
      </tr>`).join("");
    
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Eurobet Hashtags</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body><table>${tableHeader}${tableRows}</table></body>
      </html>`;
    
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eurobet_report_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container position-relative">
        <div className="hero-glow"></div>
        
        <div className="row align-items-end mb-5 pt-4">
          <div className="col-12 col-md-8">
            <div className="badge-premium mb-3" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084ff' }}>Eurobet Wave 2-4</div>
            <h1 className="h1-premium mb-0">Eurobet Social Hub</h1>
            <p className="text-secondary lead mt-2">Monitoraggio avanzato hashtag &bull; Wave 2, 3, 4</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button className="btn btn-primary" onClick={handleExportExcel}>
              SCARICA REPORT EXCEL
            </button>
          </div>
        </div>

        <div className="row mb-5 g-4">
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Partecipanti Totali</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{data.length}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Prossima Estrazione</div>
                    <div className="h2 mb-0">15 APR</div>
                    <div className="small text-secondary mt-1">4 estrazioni totali</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Hashtag Attivo</div>
                    <div className="h4 mb-0">#sentilapassionedalvivo</div>
                    <div className="small text-secondary mt-1">Monitoraggio IG</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Stato Sistema</div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                        <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                        <span className="text-success small fw-bold">OPERATIVO</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="glass-card p-0 mb-5 overflow-hidden">
          <div className="table-responsive">
            <table className="table" {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                }) : (
                    <tr>
                        <td colSpan="4" className="text-center py-5 text-secondary">
                           <div className="opacity-50 italic">Nessun dato trovato. Lo scraper è in attesa di nuovi contenuti.</div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EurobetDashboard;
