import React from 'react';
import DataTable from './data-table';

/**
 * SGSTable - A compatibility wrapper for Ant Design style columns
 * to work with the project's TanStack Table based DataTable.
 */
const SGSTable = ({ data = [], columns = [], ...props }) => {
  const convertedColumns = columns.map((col, index) => {
    // Basic mapping
    const converted = {
      id: col.key || col.dataIndex || `col-${index}`,
      header: col.title || " ",
      accessorKey: col.dataIndex,
    };

    // Map render to cell
    if (col.render) {
      converted.cell = ({ row }) => {
        const record = row.original;
        const text = col.dataIndex ? record[col.dataIndex] : record;
        return col.render(text, record, row.index);
      };
    }

    // Add sorting capability if title exists as string
    if (typeof col.title === 'string') {
      converted.header = ({ column }) => {
        return (
          <div 
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {col.title}
          </div>
        );
      };
    }

    return converted;
  });

  return <DataTable data={data} columns={convertedColumns} {...props} />;
};

export default SGSTable;
