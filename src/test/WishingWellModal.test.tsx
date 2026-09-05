import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishingWellModal } from '../components/modals/WishingWellModal';

describe('WishingWellModal Component', () => {
  it('renders wishing well modal with first unlocked wish', () => {
    const handleClose = vi.fn();
    render(<WishingWellModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Air Mancur Harapan/i)).toBeInTheDocument();
    expect(screen.getByText(/Kesehatan & Perlindungan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lempar Koin Emas/i })).toBeInTheDocument();
  });

  it('triggers coin toss when button is clicked', () => {
    const handleClose = vi.fn();
    render(<WishingWellModal isOpen={true} onClose={handleClose} />);

    const tossBtn = screen.getByRole('button', { name: /Lempar Koin Emas/i });
    fireEvent.click(tossBtn);

    expect(screen.getByText(/Koin Terlempar/i)).toBeInTheDocument();
  });
});
