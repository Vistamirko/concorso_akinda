import React, { useMemo } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import { CSVLink } from "react-csv";

// Try to load data if it exists, otherwise use empty array
let hashtagData = [];
try {
  hashtagData = require("../data/hashtag-instagram.json");
} catch (e) {
  hashtagData = [];
}

const columns = [
  { Header: "ID Post", accessor: "id", Cell: ({value}) => <span className="font-monospace small opacity-75">{value}</span> },
  { Header: "Didascalia", accessor: "caption", Cell: ({value}) => <div className="text-truncate" style={{maxWidth: '300px'}}>{value}</div> },
  { Header: "Autore", accessor: "fullName", Cell: ({value}) => <span className="fw-bold">{value}</span> },
  { Header: "Sorgente", accessor: "url", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>VEDI POST</a> },
];

function EurobetDashboard() {
  const data = useMemo(() => hashtagData, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const csvData = [
    ["ID", "Didascalia", "Utente", "URL"],
    ...data.map(p => [p.id, p.caption, p.fullName, p.url])
  ];

  return (
    <div className="App">
      <Navbar />
      <div className="container position-relative">
        <div className="hero-glow"></div>
        
        <div className="row align-items-end mb-5 pt-4">
          <div className="col-12 col-md-8">
            <div className="badge-premium mb-3" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084ff' }}>Campagna Instagram</div>
            <h1 className="h1-premium mb-0">Eurobet Social Hub</h1>
            <p className="text-secondary lead mt-2">Monitoraggio avanzato hashtag &bull; Aprile - Maggio</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <CSVLink className="btn btn-primary" filename="eurobet_hashtags.csv" data={csvData}>
              SCARICA REPORT CSV
            </CSVLink>
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
                    <div className="h4 mb-0">#eurobet2026</div>
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
