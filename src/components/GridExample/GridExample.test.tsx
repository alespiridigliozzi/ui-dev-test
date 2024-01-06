import { render, screen, waitFor } from '@testing-library/react';
import { GridExample } from './GridExample';
import { fetchUsersData, getColumnDefs } from './gridExampleUtils.ts';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./gridExampleUtils', () => ({
  fetchUsersData: jest.fn(),
  getColumnDefs: jest.fn(),
}));

describe('GridExample', () => {
  it('renders the grid with data', async () => {
    (fetchUsersData as jest.Mock).mockResolvedValue([
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
    ]);

    (getColumnDefs as jest.Mock).mockReturnValue([
      { headerName: 'Name', field: 'name' },
      { headerName: 'Website', field: 'website' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Geo', field: 'geo' },
      { headerName: 'Bs', field: 'bs' },
      { headerName: 'Address', field: 'address' },
    ]);

    render(<GridExample />);

    // this is necessary to unsure we wait for all data to be loaded otherwise the test will fail
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Geo')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Bs')).toBeInTheDocument();
    });

    expect(screen.getByTestId('data-test')).toBeInTheDocument();
  });
});
