import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import { CSVLink } from "react-csv";
import config from "../config";

function PennyDashboard({ platform }) {
  const [data, setData] = useState([]);

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const csvData = [
    ["Utente", "Data", "Commento", "URL"],
    ...data.map(p => [p.Username || p.Name, p.Date || p.Data, p.CommentText || p.Comment, p.ProfileURL || p.Id])
  ];

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
            <CSVLink className="btn btn-primary" filename={`penny_${platform}_comments.csv`} data={csvData}>
              ESPORTA DATI CSV
            </CSVLink>
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
