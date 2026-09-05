import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HUD } from '../components/ui/HUD';
import { FishingGameModal } from '../components/modals/FishingGameModal';
import { MasJoLoveModal } from '../components/modals/MasJoLoveModal';
import { TreasureShard } from '../types';

const mockShards: TreasureShard[] = [
  { id: 1, title: 'Permata #1', position: [0, 1, 5], isCollected: false, hint: 'Dermaga', color: '#ff4d6d' },
];

describe('Romantic Pier, Fishing Mini-Game & Komponen Cinta', () => {
  it('renders pier sitting button when near pier bench, and standing button when seated', () => {
    const handleToggleSitting = vi.fn();
    const handleOpenFishing = vi.fn();
    const handleOpenLove = vi.fn();

    // 1. Near Pier Bench at edge of island in water (Z = 25.5)
    const { rerender } = render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 25.5]} // Near pier bench
        travelMode="walking"
        isSittingOnPier={false}
        onToggleSittingPier={handleToggleSitting}
        onOpenFishing={handleOpenFishing}
        onOpenLoveModal={handleOpenLove}
      />
    );

    const sitBtn = screen.getByText(/Duduk Berdua di Dermaga/i);
    expect(sitBtn).toBeInTheDocument();
    fireEvent.click(sitBtn);
    expect(handleToggleSitting).toHaveBeenCalled();

    // 2. Seated on Bench
    rerender(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 25.7]}
        travelMode="walking"
        isSittingOnPier={true}
        onToggleSittingPier={handleToggleSitting}
        onOpenFishing={handleOpenFishing}
        onOpenLoveModal={handleOpenLove}
      />
    );

    const standBtn = screen.getByText(/Berdiri Kembali/i);
    expect(standBtn).toBeInTheDocument();
    fireEvent.click(standBtn);
    expect(handleToggleSitting).toHaveBeenCalled();
  });

  it('renders "Ajak Bicara Mas Jo" button on foot and triggers love modal', () => {
    const handleOpenLove = vi.fn();
    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 5]}
        travelMode="walking"
        isSittingOnPier={false}
        onOpenLoveModal={handleOpenLove}
      />
    );

    const loveBtn = screen.getByText(/Ajak Bicara Mas Jo/i);
    expect(loveBtn).toBeInTheDocument();
    fireEvent.click(loveBtn);
    expect(handleOpenLove).toHaveBeenCalled();
  });

  it('renders MasJoLoveModal with sweet quotes and responds to hug button', () => {
    const handleClose = vi.fn();
    render(<MasJoLoveModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Untuk Wanita Terhebatku/i)).toBeInTheDocument();
    expect(screen.getByText(/Dari Mas Jo untuk Dinda/i)).toBeInTheDocument();

    // Next message button
    const nextMsgBtn = screen.getByText(/Ganti Pesan/i);
    fireEvent.click(nextMsgBtn);
    expect(screen.getByText(/Rumah Terbaikku/i)).toBeInTheDocument();

    // Hug button
    const hugBtn = screen.getByText(/Peluk Mas Jo/i);
    fireEvent.click(hugBtn);
    expect(screen.getByText(/Mas Jo memeluk erat Dinda/i)).toBeInTheDocument();
  });

  it('renders FishingGameModal and executes cast and reeling flow', () => {
    const handleClose = vi.fn();
    render(<FishingGameModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Memancing di Dermaga/i)).toBeInTheDocument();
    const castBtn = screen.getByRole('button', { name: /Lempar Kail ke Laut/i });
    expect(castBtn).toBeInTheDocument();

    fireEvent.click(castBtn);
    expect(screen.getByText(/Menunggu ikan mendekat/i)).toBeInTheDocument();
  });

  it('renders graphics quality toggle in HUD and handles quality switch', () => {
    const handleToggleGraphics = vi.fn();
    const { rerender } = render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
        graphicsQuality="high"
        onToggleGraphicsQuality={handleToggleGraphics}
      />
    );

    const highBtn = screen.getByTitle(/Ubah Kualitas Grafik/i);
    expect(highBtn).toBeInTheDocument();
    expect(screen.getByText(/Grafik: Tinggi/i)).toBeInTheDocument();
    fireEvent.click(highBtn);
    expect(handleToggleGraphics).toHaveBeenCalled();

    rerender(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
        graphicsQuality="low"
        onToggleGraphicsQuality={handleToggleGraphics}
      />
    );

    expect(screen.getByText(/Grafik: Hemat/i)).toBeInTheDocument();
  });
});
