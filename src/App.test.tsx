import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Dashboard component to avoid API calls in tests
jest.mock('./components/Dashboard', () => ({
  Dashboard: () => (
    <div>
      <h2>Live Crypto Dashboard</h2>
      <p>Real-time data, analysis, and predictions</p>
    </div>
  )
}));

describe('App Component', () => {
  test('renders crypto dashboard title', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { name: /crypto dashboard/i, level: 1 });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders live crypto dashboard message', () => {
    render(<App />);
    const dashboardElement = screen.getByText(/live crypto dashboard/i);
    expect(dashboardElement).toBeInTheDocument();
  });
});