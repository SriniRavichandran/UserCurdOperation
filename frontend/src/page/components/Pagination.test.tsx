import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    page: 1,
    totalPages: 5,
    total: 45,
    limit: 10,
    onPageChange: vi.fn(),
    onLimitChange: vi.fn()
  };

  const renderWithChakra = (ui: React.ReactElement) => {
    return render(<ChakraProvider>{ui}</ChakraProvider>);
  };

  it('renders correctly with given pagination stats', () => {
    renderWithChakra(<Pagination {...defaultProps} />);
    expect(screen.getByText('Showing')).toBeInTheDocument();
    expect(screen.getByText('1–10')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('calls onPageChange when page button is clicked', () => {
    renderWithChakra(<Pagination {...defaultProps} />);
    const pageTwoButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(pageTwoButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    renderWithChakra(<Pagination {...defaultProps} />);
    const prevButton = screen.getByRole('button', { name: 'Previous page' });
    expect(prevButton).toBeDisabled();
  });

  it('calls onLimitChange when select value is changed', () => {
    renderWithChakra(<Pagination {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '25' } });
    expect(defaultProps.onLimitChange).toHaveBeenCalledWith(25);
  });
});
