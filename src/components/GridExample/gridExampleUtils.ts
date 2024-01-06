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

  const columns = Object.entries(userDataKey).map(([key, value]) => {
    switch (key) {
      case UserDataKeys.id:
        return { headerName: key, field: key, hide: true };
      case UserDataKeys.address:
        return {
          headerName: capitalizeFirstLetter(key),
          children: Object.entries(value).map(([subKey, subValue]) => {
            const subObject = subValue as Record<string, unknown>;
            if (subKey === UserDataKeys.geo) {
              return {
                headerName: capitalizeFirstLetter(subKey),
                children: Object.keys(subObject).map((geoKey) => ({
                  headerName: capitalizeFirstLetter(geoKey),
                  field: `${UserDataKeys.address}.${UserDataKeys.geo}.${geoKey}`,
                  cellStyle: { color: 'white', backgroundColor: 'blue' },
                })),
              };
            }
            return {
              headerName: capitalizeFirstLetter(subKey),
              field: `${UserDataKeys.address}.${subKey}`,
              cellStyle: { color: 'white', backgroundColor: 'blue' },
            };
          }),
        };
      case UserDataKeys.company:
        return {
          headerName: capitalizeFirstLetter(key),
          children: Object.entries(value).map(([subKey]) => ({
            headerName: capitalizeFirstLetter(subKey),
            field: `${UserDataKeys.company}.${subKey}`,
            columnGroupShow: subKey === 'name' ? 'closed' : 'open',
          })),
        };
      case UserDataKeys.website:
        return {
          headerName: capitalizeFirstLetter(key),
          field: key,
          cellRenderer: LinkRenderer,
        };
      default:
        return { headerName: capitalizeFirstLetter(key), field: key };
    }
  });

  return columns;
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
