import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.s3BaseUrl}${config.fbPostPath}`);
        if (!response.ok) throw new Error('Data not found on S3');
        const jsonData = await response.json();
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        console.warn("Using local fallback or empty data:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Columns array created for table header
  const columns = useMemo(() => [
    { Header: "ID", accessor: "id" },
    { Header: "Nome", accessor: "name" },
    { Header: "URL Profilo", accessor: "profileUrl", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="text-secondary small">Vedi</a> },
    { Header: "Hashtag", accessor: "hashtag" },
    { Header: "Post", accessor: "url", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light py-0 px-2" style={{fontSize: '0.7rem'}}>LINK</a> },
    { Header: "Data", accessor: "date" },
    { Header: "Testo", accessor: "text", Cell: ({value}) => <div className="text-truncate" style={{maxWidth: '200px'}}>{value}</div> },
  ], []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.text || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ 
    columns, 
    data: filteredData 
  });


  const handleExportExcel = () => {
    // Genera un file CSV con BOM UTF-8 per la massima compatibilità
    const csvHeader = ["ID", "Nome", "URL Profilo", "Hashtag", "URL Post", "Data", "Testo"];
    const csvRows = filteredData.map(p => [
      p.id || "",
      p.name || "",
      p.profileUrl || "",
      p.hashtag || "",
      p.url || "",
      p.date || "",
      (p.text || "").replace(/\n/g, " ")
    ]);
    
    const csvContent = [csvHeader, ...csvRows]
      .map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `archive_fb_posts_${new Date().toISOString().split('T')[0]}.csv`;
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
            <div className="badge-premium mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>Archivio Storico</div>
            <h1 className="h1-premium mb-0">Cronologia Facebook</h1>
            <p className="text-secondary lead mt-2">Dati storici partecipazioni Facebook Hashtag &bull; Penny Archives</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button className="btn btn-primary" onClick={handleExportExcel}>
              SCARICA EXCEL
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
                            placeholder="Cerca per nome utente o testo del post..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>


        <div className="glass-card p-0 mb-5 overflow-hidden">
          {loading ? (
             <div className="text-center py-5 text-secondary italic">Caricamento dati da S3...</div>
          ) : (
            <div className="table-responsive">
              <table className="table" {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.length > 0 ? rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        ))}
                      </tr>
                    );
                  }) : (
                      <tr>
                          <td colSpan={columns.length} className="text-center py-5 text-secondary">
                              <div className="opacity-50 italic">Nessun dato storico trovato.</div>
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
