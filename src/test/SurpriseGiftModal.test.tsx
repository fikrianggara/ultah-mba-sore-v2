import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SurpriseGiftModal } from '../components/modals/SurpriseGiftModal';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('SurpriseGiftModal Component', () => {
  it('renders gift box ready to unbox', () => {
    const handleClose = vi.fn();
    render(<SurpriseGiftModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Kado Rahasia Buat Dinda/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buka Kado Sekarang/i })).toBeInTheDocument();
  });

  it('unboxes gift and reveals Jejee mascot with message', () => {
    const handleClose = vi.fn();
    render(<SurpriseGiftModal isOpen={true} onClose={handleClose} />);

    const openBtn = screen.getByRole('button', { name: /Buka Kado Sekarang/i });
    fireEvent.click(openBtn);

    expect(screen.getByText(/Cilukbaaa! Jejee Hadir!/i)).toBeInTheDocument();
    expect(screen.getByText(/Peluk Jauh dari Mas Jo & Jejee/i)).toBeInTheDocument();
  });
});
