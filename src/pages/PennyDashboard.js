import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";



function PennyDashboard({ platform }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataPath = platform === "instagram" ? config.igCommentPath : config.pennyDataPath;
        const response = await fetch(`${config.s3BaseUrl}${dataPath}`);
        if (!response.ok) throw new Error('Data not found on S3');
        const jsonData = await response.json();
        
        // Handle platform specific filtering if the JSON is unified
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        console.warn("Using local fallback or empty data:", (e instanceof Error) ? e.message : e);
        setData([]);
      }
    };
    fetchData();
  }, [platform]);

  // Dynamic columns based on platform schema
  const columns = useMemo(() => {
    if (platform === 'facebook') {
      return [
        { Header: "Nome Utente", accessor: "Name", Cell: ({value}) => <span className="fw-bold">{value}</span> },
        { Header: "Data e Ora", accessor: "Data", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
        { Header: "Testo Commento", accessor: "Comment", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
      ];
    } else {
      return [
        { Header: "Nome Utente", accessor: "Username", Cell: ({value}) => <span className="fw-bold">{value}</span> },
        { Header: "Data e Ora", accessor: "Date", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
        { Header: "Testo Commento", accessor: "CommentText", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
        { Header: "Link Profilo", accessor: "ProfileURL", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>PROFILO</a> },
      ];
    }
  }, [platform]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      (item.Username || item.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.CommentText || item.Comment || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredData 
  });


  const handleExportExcel = () => {
    // Genera un file Excel compatibile usando il formato Tab-Separated Values (UTF-16LE)
    const headers = platform === 'facebook' 
      ? ["Utente", "Data", "Commento"]
      : ["Utente", "Data", "Commento", "URL"];
      
    const rows = filteredData.map(p => {
      const row = [
        p.Username || p.Name || "",
        p.Date || p.Data || "",
        ((p.CommentText || p.Comment) || "").replace(/\n/g, " ")
      ];
      if (platform === 'instagram') {
        row.push(p.ProfileURL || p.Id || "");
      }
      return row;
    });

    const content = [headers, ...rows]
      .map(row => row.join("\t"))
      .join("\n");

    // Codifica in UTF-16LE con BOM
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
    a.download = `penny_${platform}_report_${new Date().toISOString().split('T')[0]}.xls`;
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
            <div className="badge-premium mb-3" style={{ background: 'rgba(0, 112, 243, 0.1)', color: '#0070f3' }}>Engagement {platform.toUpperCase()}</div>
            <h1 className="h1-premium mb-0">Penny Social Hub</h1>
            <p className="text-secondary lead mt-2">Raccolta commenti e gestione estrazioni &bull; Aprile - Giugno</p>
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
                            placeholder={`Cerca tra i commenti ${platform === 'facebook' ? 'Facebook' : 'Instagram'}...`}
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
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Commenti Totali</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{data.length}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Campagna Attiva</div>
                    <div className="h4 mb-0">ESTRAZIONE #1</div>
                    <div className="small text-secondary mt-2">Aprile</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Hashtag Monitorato</div>
                    <div className="h5 mb-0" style={{ color: '#0070f3' }}>#prodottomisteriosoPENNY</div>
                    <div className="small text-secondary mt-2">Ricerca commenti</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Obiettivo</div>
                    <div className="h4 mb-0">3 ROUNDS</div>
                    <div className="small text-secondary mt-1">1 al mese</div>
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
                            <div className="opacity-50 italic">Nessun commento trovato. Si consiglia un controllo della configurazione dello scraper.</div>
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

export default PennyDashboard;
