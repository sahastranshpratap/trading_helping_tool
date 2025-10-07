import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagAnalysis from '../../components/kokonutui/tag-analysis';

// Mock the lucide react icons
jest.mock('lucide-react', () => ({
  Tag: () => <div data-testid="tag-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-icon" />,
  ArrowDownRight: () => <div data-testid="arrow-down-icon" />
}));

describe('TagAnalysis Component', () => {
  const mockTagData = {
    sector: [
      { tag: "Technology", performance: 350, performancePercent: 80, winRate: 85, tradeCount: 7 },
      { tag: "Finance", performance: 120, performancePercent: 40, winRate: 65, tradeCount: 5 },
      { tag: "Healthcare", performance: -50, performancePercent: 30, winRate: 40, tradeCount: 3 }
    ],
    timeframe: [
      { tag: "Intraday", performance: 200, performancePercent: 60, winRate: 70, tradeCount: 8 },
      { tag: "Swing", performance: 80, performancePercent: 30, winRate: 60, tradeCount: 5 }
    ]
  };

  test('renders empty state when no data is provided', () => {
    render(<TagAnalysis tagData={{}} />);
    
    expect(screen.getByText('No tag data available. Add tags to your trades to see performance analysis.')).toBeInTheDocument();
  });

  test('renders component with title', () => {
    const customTitle = "Custom Tag Analysis";
    render(<TagAnalysis tagData={mockTagData} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test('displays category tabs correctly', () => {
    render(<TagAnalysis tagData={mockTagData} />);
    
    // Check if category tabs are rendered
    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Timeframe')).toBeInTheDocument();
  });
  
  test('displays tag items from the active category', () => {
    render(<TagAnalysis tagData={mockTagData} />);
    
    // Default active category should be the first one (sector)
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    
    // Performance numbers should be visible
    expect(screen.getByText('+₹350')).toBeInTheDocument();
    expect(screen.getByText('+₹120')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument(); // Negative values are shown without the '-'
  });
  
  test('switches between categories when tabs are clicked', () => {
    render(<TagAnalysis tagData={mockTagData} />);
    
    // Initial category (sector) items are visible
    expect(screen.getByText('Technology')).toBeInTheDocument();
    
    // Click on the timeframe tab
    fireEvent.click(screen.getByText('Timeframe'));
    
    // Now timeframe items should be visible
    expect(screen.getByText('Intraday')).toBeInTheDocument();
    expect(screen.getByText('Swing')).toBeInTheDocument();
    
    // And sector items should not be visible
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
  });
  
  test('displays win rate and trade count information', () => {
    render(<TagAnalysis tagData={mockTagData} />);
    
    // Check if win rate and trade count information is displayed
    expect(screen.getByText('85% win rate')).toBeInTheDocument();
    expect(screen.getByText('7 trades')).toBeInTheDocument();
  });
  
  test('renders appropriate icons for positive and negative performance', () => {
    render(<TagAnalysis tagData={mockTagData} />);
    
    // Each tag item should have either an up or down arrow icon
    const upArrows = screen.getAllByTestId('arrow-up-icon');
    const downArrows = screen.getAllByTestId('arrow-down-icon');
    
    // In our mock data, we have 2 positive and 1 negative in the sector category
    expect(upArrows.length).toBe(2);
    expect(downArrows.length).toBe(1);
  });
  
  test('handles empty category data gracefully', () => {
    const emptyCategory = {
      empty: []
    };
    
    render(<TagAnalysis tagData={emptyCategory} />);
    
    // Click on the empty category tab
    fireEvent.click(screen.getByText('Empty'));
    
    // Should show a message for empty data
    expect(screen.getByText('No data available for this category')).toBeInTheDocument();
  });
}); 