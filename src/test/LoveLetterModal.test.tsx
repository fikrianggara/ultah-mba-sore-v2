import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoveLetterModal } from '../components/modals/LoveLetterModal';

describe('LoveLetterModal Component', () => {
  it('renders envelope when open', () => {
    const handleClose = vi.fn();
    render(<LoveLetterModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Surat Spesial Buat Dinda/i)).toBeInTheDocument();
    expect(screen.getByText(/D & J/i)).toBeInTheDocument();
  });

  it('unfolds letter when envelope is clicked', () => {
    const handleClose = vi.fn();
    render(<LoveLetterModal isOpen={true} onClose={handleClose} />);

    const openButton = screen.getByText(/Ketuk untuk Membuka Amplop/i);
    fireEvent.click(openButton);

    // Letter content should now be visible
    expect(screen.getByText(/Teruntuk mba sore cayangkuwh/i)).toBeInTheDocument();
    expect(screen.getByText(/I love you Dinda mba sore/i)).toBeInTheDocument();
    expect(screen.getByText(/Mas Jo kamu yang ganteng/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<LoveLetterModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText(/Tutup/i);
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
