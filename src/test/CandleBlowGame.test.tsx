import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CandleBlowGame } from '../components/modals/CandleBlowGame';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('CandleBlowGame Component', () => {
  it('renders with 3 active candles', () => {
    const handleClose = vi.fn();
    render(<CandleBlowGame isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Tiup Lilin Ulang Tahun/i)).toBeInTheDocument();
    expect(screen.getByText(/Sisa 3 lilin menyala/i)).toBeInTheDocument();
  });

  it('extinguishes all candles when blow all button is clicked', () => {
    const handleClose = vi.fn();
    render(<CandleBlowGame isOpen={true} onClose={handleClose} />);

    const blowBtn = screen.getByText(/Tiup Semua Lilin Sekaligus/i);
    fireEvent.click(blowBtn);

    expect(screen.getByText(/Semua lilin telah ditiup/i)).toBeInTheDocument();
    expect(screen.getByText(/Happy Birthday, Mba Sore Tercinta/i)).toBeInTheDocument();
  });
});
