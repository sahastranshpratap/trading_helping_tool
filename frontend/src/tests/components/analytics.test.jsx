import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsPage from '../../components/kokonutui/analytics';

// Mock the dependencies
jest.mock('lucide-react', () => ({
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  LineChart: () => <div data-testid="line-chart-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Target: () => <div data-testid="target-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-icon" />,
  ArrowDownRight: () => <div data-testid="arrow-down-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  CandlestickChart: () => <div data-testid="candlestick-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />
}));

jest.mock('../../components/ui/loading', () => ({
  CardLoading: () => <div data-testid="card-loading" />,
  TableLoading: () => <div data-testid="table-loading" />
}));

jest.mock('../../components/kokonutui/tag-analysis', () => ({
  __esModule: true,
  default: () => <div data-testid="tag-analysis" />
}));

// Global mock for ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe('AnalyticsPage Component', () => {
  beforeEach(() => {
    // Reset any mocks between tests
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<AnalyticsPage />);
    
    // Check loading indicators
    expect(screen.getAllByTestId('card-loading')).toHaveLength(4); // 4 metric cards
    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
  });

  test('displays page title correctly', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
  });

  test('refresh button calls fetchData', async () => {
    render(<AnalyticsPage />);
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('card-loading')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click refresh button
    const refreshButton = screen.getByLabelText('Refresh data');
    fireEvent.click(refreshButton);
    
    // Verify it goes back to loading state
    await waitFor(() => {
      expect(screen.getAllByTestId('card-loading')).toHaveLength(4);
    });
  });

  test('displays correct metric cards after loading', async () => {
    render(<AnalyticsPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('card-loading')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check metric titles
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('Profit Factor')).toBeInTheDocument();
    expect(screen.getByText('Average P&L')).toBeInTheDocument();
    expect(screen.getByText('Max Drawdown')).toBeInTheDocument();
  });

  test('renders tag analysis component', async () => {
    render(<AnalyticsPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('card-loading')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId('tag-analysis')).toBeInTheDocument();
  });

  test('displays chart sections', async () => {
    render(<AnalyticsPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('card-loading')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Profit & Loss Over Time')).toBeInTheDocument();
    expect(screen.getByText('Win/Loss Distribution')).toBeInTheDocument();
  });

  test('displays performance sections', async () => {
    render(<AnalyticsPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('card-loading')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText('Performance by Strategy')).toBeInTheDocument();
    expect(screen.getByText('Performance by Time')).toBeInTheDocument();
    expect(screen.getByText('Top Symbols')).toBeInTheDocument();
  });
}); 