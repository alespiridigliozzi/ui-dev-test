import { getColumnDefs, fetchUsersData } from './gridExampleUtils';
import fetchMock from 'jest-fetch-mock';

const mockData = [
  {
    id: 1,
    name: 'John Doe',
    username: 'john_doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      suite: 'Apt 101',
      city: 'Cityville',
      zipcode: '12345',
      geo: { lat: 40.7128, lng: -74.006 },
    },
    phone: '555-1234',
    website: 'https://example.com',
    company: {
      name: 'ABC Company',
      catchPhrase: 'Catchy phrase',
      bs: 'BS content',
    },
  },
];

describe('getColumnDefs function', () => {
  it('takes the data and returns an array with column properties', () => {
    const res = getColumnDefs(mockData);
    expect(res[0]).toHaveProperty('hide');
    expect(res[0]).toHaveProperty('headerName');
    expect(res[0]).toHaveProperty('field');
    expect(res[4]).toHaveProperty('children');
    expect(res[6]).toHaveProperty('cellRenderer');
  });

  it.each`
    input        | expected
    ${null}      | ${[]}
    ${undefined} | ${[]}
    ${0}         | ${[]}
    ${[]}        | ${[]}
    ${[{}]}      | ${[]}
    ${{}}        | ${[]}
  `('returns $expected when the input value is $input', ({ input, expected }) => {
    const result = getColumnDefs(input);
    expect(result).toEqual(expected);
  });
});

describe('fetchUsersData function', () => {
  fetchMock.enableMocks();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchMock.mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('fetches the data from the api', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ])
    );

    const result = await fetchUsersData();

    expect(result).toEqual([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ]);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('handles the error when the fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));
    const result = await fetchUsersData();
    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error while fetching data' }));
  });
});
