import React from 'react';

export default function Table({ columns, data, getRowKey }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key || c.header}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length ? (
          data.map((row, i) => (
            <tr key={getRowKey ? getRowKey(row, i) : i}>
              {columns.map((c) => (
                <td key={c.key || c.header}>
                  {typeof c.render === 'function' ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length}>
              <em>No data</em>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
