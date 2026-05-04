import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";

const columns = [
    { 
        Header: "Nome Utente", 
        accessor: "username", 
        Cell: ({row}) => (
            <div className="d-flex flex-column">
                <span className="fw-bold text-white">{row.original.username}</span>
                <span className="text-secondary small opacity-75">{row.original.fullName || ""}</span>
            </div>
        )
    },
    { Header: "Data Pubblicazione", accessor: "pubDate", Cell: ({value}) => <span className="opacity-50 small">{value || "N/D"}</span> },
    { Header: "Contenuto Post", accessor: "description", Cell: ({value}) => <div className="text-truncate" style={{maxWidth: '400px'}}>{value}</div> },
    { Header: "Link Post", accessor: "postUrl", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>VEDI SU IG</a> },
];

function EurobetDashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(config.eurobetMasterPath);
        if (!response.ok) {
          response = await fetch(`${config.s3BaseUrl}${config.eurobetMasterPath}`);
        }
        
        if (response.ok) {
          const jsonData = await response.json();
          setData(Array.isArray(jsonData) ? jsonData : []);
        }
      } catch (e) {
        console.warn("Unable to load Eurobet master data:", e);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const desc = (item.description || "").toLowerCase();
      const hasHashtags = desc.includes("#sentilapassionedalvivo") && 
                          desc.includes("#accettoregolamento") && 
                          desc.includes("#accettoprivacypolicy");
      
      if (!searchTerm) return hasHashtags;
      
      const search = searchTerm.toLowerCase();
      return hasHashtags && (
        (item.username || "").toLowerCase().includes(search) ||
        (item.fullName || "").toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredData 
  });

  const handleExportExcel = () => {
    const headers = ["Utente", "Nome Completo", "Data Pubblicazione", "Didascalia", "URL"];
    const rows = filteredData.map(p => [
      p.username || "",
      p.fullName || "",
      p.pubDate || "",
      (p.description || "").replace(/\n/g, " "),
      p.postUrl || ""
    ]);

    const content = [headers, ...rows]
      .map(row => row.join("\t"))
      .join("\n");

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
            <div className="badge-premium mb-3" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084ff' }}>Eurobet Wave 4</div>
            <h1 className="h1-premium mb-0">Eurobet Social Hub</h1>
            <p className="text-secondary lead mt-2">Monitoraggio avanzato hashtag &bull; Wave 4 (Oggi)</p>
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
                            placeholder="Cerca per nome utente, nome reale o didascalia..." 
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
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{new Set(filteredData.map(i => i.postUrl)).size}</div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Utenti Unici</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{new Set(filteredData.map(i => i.username)).size}</div>
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
