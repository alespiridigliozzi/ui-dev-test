import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';

// Row Data Interface
interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: IUserAddress;
  phone: string;
  website: string;
  company: IUserCompany;
}

interface IUserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: { lat: number; lng: number };
}

interface IUserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

// interface IColDef {
//   headerName: string;
//   field: string;
// }

type ColumnFields = IUser | IUserCompany | IUserAddress;

//Fetching the data outside the component so we can mock/unit test the fetch API as it doesn't rely on any React state
const fetchUsersData = async (): Promise<IUser[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data: IUser[] = await response.json();
    return data;
  } catch (err) {
    console.error({ message: 'Error while fetching data', error: err });
    return [];
  }
};

const getColumnFields = (usersData: ColumnFields): ColDef[] => {
  if (!usersData) return [];
  const columnFields = Object.keys(usersData).map((key) => ({ headerName: key, field: key }));
  return columnFields;
};

const getColumnsDefs = (usersData: IUser[]) => {
  if (!usersData.length) return [];

  const columns = getColumnFields(usersData[0]);
  const addressColumns = getColumnFields(usersData[0].address);
  const companyColumns = getColumnFields(usersData[0].company);

  return [...columns, ...addressColumns, ...companyColumns];
};

export const GridExample = () => {
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    fetchUsersData().then((users) => {
      console.log(users);
      setUsersData(users);
    });
  }, []);

  useEffect(() => {
    const columnsDefs: ColDef<IUser>[] = getColumnsDefs(usersData);
    setColDefs(columnsDefs);
  }, [usersData]);

  console.log(colDefs);

  return (
    <div className="ag-theme-alpine" style={{ width: 610, height: 200 }}>
      <AgGridReact rowData={usersData} columnDefs={colDefs} />
    </div>
  );
};
