import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrapbookModal } from '../components/modals/ScrapbookModal';

vi.mock('../utils/audio', () => ({
  sfx: {
    playChime: vi.fn(),
    playEngine: vi.fn(),
    playHorn: vi.fn(),
    playPop: vi.fn(),
    playCheer: vi.fn(),
  },
}));

describe('ScrapbookModal Component', () => {
  it('renders cover page when open', () => {
    const handleClose = vi.fn();
    render(<ScrapbookModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Buku Kenangan \(Scrapbook\)/i)).toBeInTheDocument();
    expect(screen.getByText(/The Story of Mba Sore & Mas Jo/i)).toBeInTheDocument();
    expect(screen.getByText(/Kisah Kita Berdua/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 4/i)).toBeInTheDocument();
  });

  it('navigates to next page on click Selanjutnya and back on Sebelumnya', () => {
    const handleClose = vi.fn();
    render(<ScrapbookModal isOpen={true} onClose={handleClose} />);

    const nextBtn = screen.getByRole('button', { name: /Selanjutnya/i });
    expect(nextBtn).toBeEnabled();

    // Click next -> Page 2 (Halaman 1)
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Awal Cerita & Senyum Favorit/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 4/i)).toBeInTheDocument();

    // Click next -> Page 3 (Halaman 2)
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Cerita Tungkal & Momen Bersama/i)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 4/i)).toBeInTheDocument();

    // Click prev -> back to Page 2
    const prevBtn = screen.getByRole('button', { name: /Sebelumnya/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Awal Cerita & Senyum Favorit/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 4/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<ScrapbookModal isOpen={true} onClose={handleClose} />);

    // Find close button
    const closeButtons = screen.getAllByRole('button');
    const closeBtn = closeButtons[0]; // Header close button
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
