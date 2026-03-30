import "../App.css";
import { CSVLink } from "react-csv";
import usersData from "../data/igcomment.json";
import { useMemo } from "react";
import { useTable } from "react-table";
import Navbar from "../navbar";

// Columns array created for table header
const columns = [
  { Header: "Username", accessor: "Username", Cell: ({value}) => <span className="fw-bold">{value}</span> },
  { Header: "Commento", accessor: "CommentText", Cell: ({value}) => <div className="text-white text-opacity-75">{value}</div> },
  { Header: "Link Profilo", accessor: "ProfileURL", Cell: ({value}) => <a href={value} target="_blank" rel="noreferrer" className="text-secondary small">Vedi</a> },
  { Header: "Data", accessor: "Date", Cell: ({value}) => <span className="opacity-50 small">{value}</span> },
];

function App() {
  // data declared to be used in table taking data from JSON file
  const data = useMemo(() => usersData, []);

  // Calling react table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Contains the column headers and table data in the required format for CSV
  const csvData = [
    ["Username", "Date", "CommentText", "ProfileURL"],
    ...data.map(({ Username, Date, CommentText, ProfileURL }) => [
      Username, Date, CommentText, ProfileURL
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
            <h1 className="h1-premium mb-0">Revisione Instagram</h1>
            <p className="text-secondary lead mt-2">Archivio storico commenti Instagram &bull; Penny Archives</p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <CSVLink className="btn btn-primary" filename="igcomment.csv" data={csvData}>
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
