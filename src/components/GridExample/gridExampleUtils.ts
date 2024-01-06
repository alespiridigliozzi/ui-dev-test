import { ColDef } from 'ag-grid-community';
import { IUser, UserDataKeys } from './gridExampleTypes';
import LinkRenderer from '../LinkRenderer/LinkRenderer';

export const fetchUsersData = async (): Promise<IUser[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data: IUser[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error while fetching data', error);
    return [];
  }
};

export const getColumnDefs = (usersData: IUser[]): ColDef[] => {
  if (!usersData || usersData.length === 0) return [];
  const userDataKey = usersData[0];
  if (!userDataKey) return [];

  const columns = [];

  for (const [key, value] of Object.entries(userDataKey)) {
    switch (key) {
      case UserDataKeys.id:
        columns.push({ headerName: key, field: key, hide: true });
        break;
      case UserDataKeys.address:
        columns.push({
          headerName: capitalizeFirstLetter(key),
          children: Object.keys(value).map((key) => {
            if (key === UserDataKeys.geo) {
              return {
                headerName: 'Geo',
                children: Object.keys(value.geo).map((key) => {
                  return {
                    headerName: capitalizeFirstLetter(key),
                    field: `${UserDataKeys.address}.${UserDataKeys.geo}.${key}`,
                    cellStyle: { color: 'white', backgroundColor: 'blue' },
                  };
                }),
              };
            }
            return {
              headerName: capitalizeFirstLetter(key),
              field: `${UserDataKeys.address}.${key}`,
              cellStyle: { color: 'white', backgroundColor: 'blue' },
            };
          }),
        });
        break;
      case UserDataKeys.company:
        columns.push({
          headerName: capitalizeFirstLetter(key),
          children: Object.keys(value).map((key) => {
            if (key === 'name') {
              return {
                headerName: capitalizeFirstLetter(key),
                field: `${UserDataKeys.company}.${key}`,
                columnGroupShow: 'closed',
              };
            }
            return {
              headerName: capitalizeFirstLetter(key),
              field: `${UserDataKeys.company}.${key}`,
              columnGroupShow: 'open',
            };
          }),
        });
        break;
      case UserDataKeys.website:
        columns.push({
          headerName: capitalizeFirstLetter(key),
          field: key,
          cellRenderer: LinkRenderer,
        });
        break;
      default:
        columns.push({ headerName: capitalizeFirstLetter(key), field: key });
        break;
    }
  }

  return columns;
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
