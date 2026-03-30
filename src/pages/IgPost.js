import "../App.css";
import { CSVLink } from "react-csv";
import usersData from "../data/hashtag-instagram.json";
import { useMemo } from "react";
import { useTable } from "react-table";
import Navbar from "../navbar";

// Columns array created for table header
const columns = [
  { Header: "Didascalia", accessor: "caption", Cell: ({value}) => <div className="text-truncate" style={{maxWidth: '200px'}}>{value}</div> },
  { Header: "ID", accessor: "id", Cell: ({value}) => <span className="opacity-50 small font-monospace">{value}</span> },
  { Header: "Nome Completo", accessor: "fullName", Cell: ({value}) => <span className="fw-bold">{value}</span> },
  { Header: "Post", accessor: "url", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light py-0 px-2" style={{fontSize: '0.7rem'}}>LINK</a> },
];

function App() {
  // data declared to be used in table taking data from JSON file
  const data = useMemo(() => usersData, []);

  // Calling react table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Contains the column headers and table data in the required format for CSV
  const csvData = [
    ["id", "caption", "fullName", "url"],
    ...data.map(({ id, caption, fullName, url }) => [
      id, caption, fullName, url
    ]),
  ];
  return (
    <div className="App">
      <Navbar />
      <div className="container position-relative">
        <div className="hero-glow"></div>
        <div className="row align-items-end mb-5 pt-4">
          <div className="col-12 col-md-8">
            <div className="badge-premium mb-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>Archivio Storico</div>
            <h1 className="h1-premium mb-0">Cronologia Instagram</h1>
            <p className="text-secondary lead mt-2">Archivio storico partecipazioni Instagram Hashtag &bull; Penny Archives</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <CSVLink className="btn btn-primary" filename="hashtag-instagram.csv" data={csvData}>
              SCARICA CSV
            </CSVLink>
          </div>
        </div>

        <div className="glass-card p-0 mb-5 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}

export default App;
