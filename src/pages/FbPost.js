import React, { useMemo, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../navbar";
import { useTable } from "react-table";
import config from "../config";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const handleExportExcel = () => {
    // Genera una tabella HTML che Excel può interpretare come foglio di calcolo
    const tableHeader = "<tr><th>ID</th><th>Nome</th><th>URL Profilo</th><th>Hashtag</th><th>URL Post</th><th>Data</th><th>Testo</th></tr>";
    const tableRows = data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.profileUrl}</td>
        <td>${p.hashtag}</td>
        <td>${p.url}</td>
        <td>${p.date}</td>
        <td>${(p.text || "").replace(/\n/g, " ")}</td>
      </tr>`).join("");
    
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Facebook Posts</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body><table>${tableHeader}${tableRows}</table></body>
      </html>`;
    
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `archive_fb_posts_${new Date().toISOString().split('T')[0]}.xls`;
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
