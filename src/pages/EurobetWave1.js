import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";


function EurobetWave1() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.s3BaseUrl}${config.eurobetWave1Path}`);
        if (!response.ok) throw new Error('Data not found on S3');
        const jsonData = await response.json();
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        console.warn("S3 fetch failed, trying local fallback:", e);
        try {
          const localResponse = await fetch(config.eurobetWave1Path);
          if (!localResponse.ok) throw new Error('Local data not found');
          const localJson = await localResponse.json();
          setData(Array.isArray(localJson) ? localJson : []);
        } catch (localError) {
          console.error("Local fallback also failed:", localError);
          setData([]);
        }
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(() => [
    { Header: "Nome Utente", accessor: "Username", Cell: ({value}) => <span className="fw-bold">{value}</span> },
    { Header: "Data e Ora", accessor: "Date", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
    { Header: "Testo Commento", accessor: "CommentText", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
    { Header: "Link Profilo", accessor: "ProfileURL", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>PROFILO</a> },
  ], []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const desc = (item.CommentText || "").toLowerCase();
      const hasHashtags = desc.includes("#sentilapassionedalvivo") && 
                          desc.includes("#accettoregolamento") && 
                          desc.includes("#accettoprivacypolicy");
      
      if (!searchTerm) return hasHashtags;
      
      const search = searchTerm.toLowerCase();
      return hasHashtags && (
        (item.Username || "").toLowerCase().includes(search) ||
        (item.CommentText || "").toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredData 
  });

  const handleExportExcel = () => {
    // Genera un file Excel compatibile usando il formato Tab-Separated Values (UTF-16LE)
    // Questo è il modo più affidabile per far sì che Excel lo apra correttamente come spreadsheet
    const headers = ["Utente", "Data", "Commento", "URL"];
    const rows = filteredData.map(p => [
      p.Username || "",
      p.Date || "",
      (p.CommentText || "").replace(/\n/g, " "),
      p.ProfileURL || ""
    ]);

    const content = [headers, ...rows]
      .map(row => row.join("\t"))
      .join("\n");

    // Codifica in UTF-16LE con BOM per far capire a Excel che è un file di dati
    const buffer = new ArrayBuffer(content.length * 2 + 2);
    const view = new DataView(buffer);
    view.setUint16(0, 0xFEFF, true); // BOM
    for (let i = 0; i < content.length; i++) {
      view.setUint16((i + 1) * 2, content.charCodeAt(i), true);
    }

    const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eurobet_wave1_report_${new Date().toISOString().split('T')[0]}.xls`;
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
            <div className="badge-premium mb-3" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084ff' }}>Eurobet Wave 1</div>
            <h1 className="h1-premium mb-0">Eurobet Social Hub</h1>
            <p className="text-secondary lead mt-2">Raccolta commenti (Engagement Post Profilo) &bull; Wave 1</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button className="btn btn-primary" onClick={handleExportExcel}>
              ESPORTA DATI EXCEL
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
                            placeholder="Cerca per nome utente o commento (filtrato per hashtag validi)..." 
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
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Commenti Validi</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{filteredData.length}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Meccanica</div>
                    <div className="h4 mb-0">COMMENTI</div>
                    <div className="small text-secondary mt-1">Post Profilo Eurobet</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Status Wave</div>
                    <div className="h5 mb-0 text-info">ATTIVA</div>
                    <div className="small text-secondary mt-1">Wave 1 di 4</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Stato Sistema</div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                        <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                        <span className="text-success small fw-bold">OPERATIVO</span>
                    </div>
                    <div className="small text-secondary opacity-50 mt-1" style={{ fontSize: '0.65rem' }}>Ultimo scraping: 13 Aprile 2026</div>
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
                            <div className="opacity-50 italic">Nessun commento trovato. Lo scraper è in attesa di caricare i nuovi dati demo.</div>
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

export default EurobetWave1;
