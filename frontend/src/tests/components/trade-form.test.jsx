import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradeForm from '../../components/kokonutui/trade-form';

// Mock the lucide react icons
jest.mock('lucide-react', () => ({
  CandlestickChart: () => <div data-testid="candlestick-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  FileText: () => <div data-testid="file-text-icon" />
}));

// Mock loading component
jest.mock('../../components/ui/loading', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner" />
}));

// Mock form error component
jest.mock('../../components/ui/error', () => ({
  FormErrorMessage: ({ errors }) => (
    <div data-testid="form-error">
      {Object.entries(errors).map(([key, value]) => (
        <div key={key} data-testid={`error-${key}`}>
          {value}
        </div>
      ))}
    </div>
  )
}));

describe('TradeForm Component', () => {
  // Mock submit function
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the form with correct title for new trade', () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    expect(screen.getByText('New Trade Entry')).toBeInTheDocument();
  });
  
  test('renders the form with correct title for editing', () => {
    render(<TradeForm onSubmit={mockSubmit} isEditing={true} />);
    
    expect(screen.getByText('Edit Trade')).toBeInTheDocument();
  });
  
  test('renders advanced options when button is clicked', () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Advanced options should not be visible initially
    expect(screen.queryByText('Advanced Trade Details')).not.toBeInTheDocument();
    
    // Click the show advanced options button
    fireEvent.click(screen.getByText('Show Advanced Options'));
    
    // Advanced options should now be visible
    expect(screen.getByText('Advanced Trade Details')).toBeInTheDocument();
    expect(screen.getByText('Trade Setup')).toBeInTheDocument();
    expect(screen.getByText('Risk-Reward Ratio')).toBeInTheDocument();
  });
  
  test('displays tag category tabs', () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Default categories should be visible
    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Timeframe')).toBeInTheDocument();
    expect(screen.getByText('Pattern')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });
  
  test('adds a tag to the active category', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // By default, first active category should be "custom"
    const tagInput = screen.getByPlaceholderText(/add custom tag/i);
    
    // Enter a tag and submit
    fireEvent.change(tagInput, { target: { value: 'My Test Tag' } });
    fireEvent.click(screen.getByText('Add')); // Click the add button
    
    // The tag should appear in the list
    await waitFor(() => {
      expect(screen.getByText('My Test Tag')).toBeInTheDocument();
    });
  });
  
  test('removes a tag when delete button is clicked', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Add a tag first
    const tagInput = screen.getByPlaceholderText(/add custom tag/i);
    fireEvent.change(tagInput, { target: { value: 'Tag To Remove' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Verify tag was added
    await waitFor(() => {
      expect(screen.getByText('Tag To Remove')).toBeInTheDocument();
    });
    
    // Get all remove buttons next to tags
    const removeButtons = screen.getAllByTestId('trash-icon');
    
    // Click the remove button
    fireEvent.click(removeButtons[0]);
    
    // Tag should be removed
    await waitFor(() => {
      expect(screen.queryByText('Tag To Remove')).not.toBeInTheDocument();
    });
  });
  
  test('switches between tag categories', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Default active category should be "custom"
    expect(screen.getByPlaceholderText(/add custom tag/i)).toBeInTheDocument();
    
    // Click on the sector category
    fireEvent.click(screen.getByText('Sector'));
    
    // Input placeholder should now reference the sector category
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/add sector tag/i)).toBeInTheDocument();
    });
  });
  
  test('adds a new custom category', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Find the input for new category
    const categoryInput = screen.getByPlaceholderText('New category');
    
    // Enter a new category name
    fireEvent.change(categoryInput, { target: { value: 'Strategy Result' } });
    
    // Click the add button or press Enter
    const addCategoryButton = screen.getAllByText('Add')[1]; // Second Add button is for categories
    fireEvent.click(addCategoryButton);
    
    // New category should appear in the tabs
    await waitFor(() => {
      expect(screen.getByText('Strategy Result')).toBeInTheDocument();
    });
    
    // And it should become the active category
    expect(screen.getByPlaceholderText(/add strategy result tag/i)).toBeInTheDocument();
  });
  
  test('does not allow duplicate tags in the same category', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Add a tag
    const tagInput = screen.getByPlaceholderText(/add custom tag/i);
    fireEvent.change(tagInput, { target: { value: 'Unique Tag' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Try to add the same tag again
    fireEvent.change(tagInput, { target: { value: 'Unique Tag' } });
    fireEvent.click(screen.getByText('Add'));
    
    // There should still be only one instance of the tag
    const tagElements = screen.getAllByText('Unique Tag');
    expect(tagElements.length).toBe(1);
  });
  
  test('does not allow removing default categories', async () => {
    render(<TradeForm onSubmit={mockSubmit} />);
    
    // Create a custom category
    const categoryInput = screen.getByPlaceholderText('New category');
    fireEvent.change(categoryInput, { target: { value: 'Custom Category' } });
    fireEvent.click(screen.getAllByText('Add')[1]);
    
    // Verify the new category has a close button
    await waitFor(() => {
      const customCategoryElement = screen.getByText('Custom Category');
      expect(customCategoryElement).toBeInTheDocument();
      
      // The parent element should contain a button with '×' text for removal
      const parentElement = customCategoryElement.closest('button');
      expect(parentElement.textContent).toContain('Custom Category');
      
      // Find all removal buttons in custom categories
      const removalButtonsWithinText = screen.getAllByText('×');
      expect(removalButtonsWithinText.length).toBeGreaterThan(0);
    });
    
    // In contrast, the default "Pattern" category should not have a close button
    const patternElement = screen.getByText('Pattern');
    const patternParent = patternElement.closest('button');
    expect(patternParent.textContent).not.toContain('×');
  });
}); 