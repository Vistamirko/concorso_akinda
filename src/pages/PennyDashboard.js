import React, { useMemo } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import { CSVLink } from "react-csv";
import fbData from "../data/fbcomment.json";
import igData from "../data/igcomment.json";

function PennyDashboard({ platform }) {
  const data = useMemo(() => {
    return platform === 'facebook' ? fbData : igData;
  }, [platform]);

  // Dynamic columns based on platform schema
  const columns = useMemo(() => {
    if (platform === 'facebook') {
      return [
        { Header: "ID", accessor: "Id", Cell: ({value}) => <span className="opacity-50 small font-monospace">{value}</span> },
        { Header: "Nome Utente", accessor: "Name", Cell: ({value}) => <span className="fw-bold">{value}</span> },
        { Header: "Data", accessor: "Data", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
        { Header: "Commento", accessor: "Comment", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
      ];
    } else {
      return [
        { Header: "Username", accessor: "Username", Cell: ({value}) => <span className="fw-bold">{value}</span> },
        { Header: "Orario Commento", accessor: "Date", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
        { Header: "Contenuto", accessor: "CommentText", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
        { Header: "Link Social", accessor: "ProfileURL", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light border-opacity-10 py-1 px-3" style={{fontSize: '0.7rem'}}>PROFILO</a> },
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
            <p className="text-secondary lead mt-2">Raccolta commenti e gestione estrazioni &bull; Post Mensili</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <CSVLink className="btn btn-primary" filename={`penny_${platform}_comments.csv`} data={csvData}>
              ESPORTA DATI CSV
            </CSVLink>
          </div>
        </div>

        <div className="row mb-5 g-4">
            <div className="col-md-4">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Commenti Totali</div>
                    <div className="h1-premium mb-0" style={{ fontSize: '2.5rem' }}>{data.length}</div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Campagna Attiva</div>
                    <div className="h4 mb-0">POST #1 (APRILE)</div>
                    <div className="small text-secondary mt-2">Termina: 30 APR</div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="glass-card text-center py-4">
                    <div className="text-secondary small fw-bold tracking-widest text-uppercase mb-2">Obiettivo Estrazioni</div>
                    <div className="h3 mb-0">3 ROUNDS</div>
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
