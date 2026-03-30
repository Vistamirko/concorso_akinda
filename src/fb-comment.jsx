import "./App.css";
import { CSVLink } from "react-csv";
import usersData from "./data/users.json";
import { useMemo } from "react";
import { useTable } from "react-table";
import Navbar from "./navbar";

// Columns array created for table header
const columns = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: "name" },
  { Header: "Username", accessor: "username" },
  { Header: "Email", accessor: "email" },
  { Header: "Phone", accessor: "phone" },
  { Header: "Website", accessor: "website" },
];

function App() {
  // data declared to be used in table taking data from JSON file
  const data = useMemo(() => usersData, []);

  // Calling react table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Contains the column headers and table data in the required format for CSV
  const csvData = [
    ["ID", "Name", "Username", "Email", "Phone", "Website"],
    ...data.map(({ id, name, username, email, phone, website }) => [
      id,
      name,
      username,
      email,
      phone,
      website,
    ]),
  ];
  return (
    <div className="App">
        <Navbar></Navbar>
        Fb commenti
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-3 ms-auto">
            
            <CSVLink
              className="btn btn-primary w-100 mt-30"
              filename="my-file.csv"
              data={csvData}
            >
              Esporta csv
            </CSVLink>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered mt-2" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Table End */}
    </div>
  );
}

export default App;
