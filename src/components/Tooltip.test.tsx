import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('should render children correctly', () => {
    render(
      <Tooltip content="Test tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Test tooltip content" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByText('Test tooltip content')).not.toBeInTheDocument();
  });

  it('should support different positions', async () => {
    render(
      <Tooltip content="Test tooltip" position="left" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Test tooltip').parentElement;
      expect(tooltip).toHaveClass('right-full');
    });
  });

  it('should handle disabled state', () => {
    render(
      <Tooltip content="Test tooltip" disabled>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });
});