import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useState } from 'react';
import { IUser } from './gridExampleTypes';
import { fetchUsersData, getColumnDefs } from './gridExampleUtils';

export const GridExample = () => {
  const [rowData, setRowData] = useState<IUser[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>(getColumnDefs([]));

  const defaultColDef = useMemo(
    () => ({
      filter: true,
    }),
    []
  );

  useEffect(() => {
    fetchUsersData().then((users) => {
      setRowData(users);
      setColDefs(getColumnDefs(users));
    });
  }, []);

  return (
    <div data-testid="data-test" className="ag-theme-alpine" style={{ width: '98vw', height: 500 }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef} />
    </div>
  );
};
