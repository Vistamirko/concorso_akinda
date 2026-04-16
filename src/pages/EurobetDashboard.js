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
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try local data first for immediate updates
        let response = await fetch(config.eurobetWave2Path);
        
        if (!response.ok) {
           console.log("Local Wave 2 data not found, trying S3...");
           response = await fetch(`${config.s3BaseUrl}${config.eurobetWave2Path}`);
        }

        if (!response.ok) throw new Error('Data not found');
        
        const jsonData = await response.json();
        const finalData = Array.isArray(jsonData) ? jsonData : [];
        
        // If local/S3 is empty, try the other as fallback
        if (finalData.length === 0) {
             const fallbackResponse = await fetch(`${config.s3BaseUrl}${config.eurobetWave2Path}`);
             if (fallbackResponse.ok) {
                 const fallbackData = await fallbackResponse.json();
                 setData(Array.isArray(fallbackData) ? fallbackData : []);
                 return;
             }
        }

        setData(finalData);
      } catch (e) {
        console.warn("Unable to load Eurobet Wave 2 data:", e);
        setData([]);
      }
    };
    fetchData();
  }, []);


  const filteredData = useMemo(() => {
    return data.filter(item => {
      const desc = (item.caption || "").toLowerCase();
      const hasHashtags = desc.includes("#sentilapassionedalvivo") && 
                          desc.includes("#accettoregolamento") && 
                          desc.includes("#accettoprivacypolicy");
      
      if (!searchTerm) return hasHashtags;
      
      const search = searchTerm.toLowerCase();
      return hasHashtags && (
        (item.fullName || "").toLowerCase().includes(search) ||
        (item.caption || "").toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredData 
  });

  const handleExportExcel = () => {
    // Genera una tabella HTML che Excel può interpretare come foglio di calcolo
    const tableHeader = "<tr><th>ID</th><th>Utente</th><th>Data Pubblicazione</th><th>Didascalia</th><th>URL</th></tr>";
    const tableRows = filteredData.map(p => `
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

        <div className="row mb-4">
            <div className="col-12">
                <div className="glass-card p-3">
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-search text-secondary"></i>
                        <input 
                            type="text" 
                            className="form-control bg-transparent border-0 text-white shadow-none search-input" 
                            placeholder="Cerca per nome utente o didascalia (filtrato per validità)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="row mb-5 g-4">
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Partecipanti Validi</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{filteredData.length}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Post Unici</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{new Set(filteredData.map(i => i.url)).size}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Utenti Unici</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{new Set(filteredData.map(i => i.fullName)).size}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4 border-azure">
                    <div className="text-azure small fw-bold tracking-widest text-uppercase mb-2">Hashtag Monitorato</div>
                    <div className="h6 mb-0 text-white">#sentilapassionedalvivo</div>
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
