

// Each column is an object with 'name' and a 'render' function
export default function BaseTable({ columns, rows }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            {
              columns.map((col, index) => (
                <th scope="col" key={index}>
                  {col}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}