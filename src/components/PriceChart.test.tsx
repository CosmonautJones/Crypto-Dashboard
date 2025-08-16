import { render, screen } from '@testing-library/react';
import { PriceChart } from './PriceChart';
import { HistoricalPrice } from '../types/crypto';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

describe('PriceChart', () => {
  const mockPrices: HistoricalPrice[] = [
    { timestamp: 1640995200000, price: 47000 },
    { timestamp: 1641081600000, price: 47500 },
    { timestamp: 1641168000000, price: 46800 },
    { timestamp: 1641254400000, price: 47200 }
  ];

  it('should render chart with price data', () => {
    render(
      <PriceChart
        data={mockPrices}
        title="Bitcoin Price Chart"
        height={400}
      />
    );

    expect(screen.getByText('Bitcoin Price Chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
  });

  it('should display loading state when no data', () => {
    render(
      <PriceChart
        data={[]}
        title="Bitcoin Price Chart"
        height={400}
        loading={true}
      />
    );

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('should display error state when error provided', () => {
    render(
      <PriceChart
        data={[]}
        title="Bitcoin Price Chart"
        height={400}
        error="Failed to load data"
      />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('should use custom height', () => {
    render(
      <PriceChart
        data={mockPrices}
        title="Bitcoin Price Chart"
        height={600}
      />
    );

    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('should show moving average when enabled', () => {
    render(
      <PriceChart
        data={mockPrices}
        title="Bitcoin Price Chart"
        height={400}
        showMovingAverage={true}
      />
    );

    // Should render two lines (price + moving average)
    const lines = screen.getAllByTestId('line');
    expect(lines).toHaveLength(2);
  });

  it('should display price trend indicator', () => {
    render(
      <PriceChart
        data={mockPrices}
        title="Bitcoin Price Chart"
        height={400}
        trend="bullish"
      />
    );

    expect(screen.getByText('↗')).toBeInTheDocument();
  });

  it('should display bearish trend indicator', () => {
    render(
      <PriceChart
        data={mockPrices}
        title="Bitcoin Price Chart"
        height={400}
        trend="bearish"
      />
    );

    expect(screen.getByText('↘')).toBeInTheDocument();
  });
});