import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreasureRadar } from '../components/ui/TreasureRadar';
import { TreasureRewardModal } from '../components/modals/TreasureRewardModal';
import { INITIAL_SHARDS } from '../components/world/TreasureHuntGems';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Treasure Hunt System', () => {
  it('renders radar counter and distance indicator', () => {
    render(<TreasureRadar shards={INITIAL_SHARDS} playerPos={[0, 0.06, 5]} />);

    expect(screen.getByText(/0\/5/i)).toBeInTheDocument();
  });

  it('shows hint popover when radar is clicked', () => {
    render(<TreasureRadar shards={INITIAL_SHARDS} playerPos={[0, 0.06, 5]} />);

    const radar = screen.getByText(/0\/5/i);
    fireEvent.click(radar);

    expect(screen.getByText(/Petunjuk Kepingan/i)).toBeInTheDocument();
  });

  it('renders reward celebration when all shards collected', () => {
    const handleClose = vi.fn();
    const handleOpenScrapbook = vi.fn();

    render(
      <TreasureRewardModal
        isOpen={true}
        onClose={handleClose}
        onOpenScrapbook={handleOpenScrapbook}
      />
    );

    expect(screen.getByText(/Master of Memories/i)).toBeInTheDocument();
    expect(screen.getByText(/5\/5 Kepingan Cinta Lengkap/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Luncurkan Kembang Api/i })).toBeInTheDocument();
  });
});
