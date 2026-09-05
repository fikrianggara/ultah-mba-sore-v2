import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HUD } from '../components/ui/HUD';
import { LANDMARKS } from '../utils/constants';
import { TreasureShard } from '../types';

const mockShards: TreasureShard[] = [
  { id: 1, title: 'Permata Cinta #1', position: [0, 1, 5], isCollected: false, hint: 'Di dekat dermaga', color: '#ff4d6d' },
  { id: 2, title: 'Permata Cinta #2', position: [5, 1, 0], isCollected: true, hint: 'Di bawah pohon', color: '#ffd166' },
];

describe('HUD Component', () => {
  it('renders header title and navigation buttons including Scrapbook and TimeOfDay', () => {
    const handleOpen = vi.fn();
    const handleTeleport = vi.fn();
    const handleHorn = vi.fn();
    const handleToggleTime = vi.fn();

    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={handleOpen}
        onTeleportTo={handleTeleport}
        onHorn={handleHorn}
        timeOfDay="day"
        onToggleTimeOfDay={handleToggleTime}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
      />
    );

    expect(screen.getByText(/Sore Island/i)).toBeInTheDocument();
    expect(screen.getByText(/Kue/i)).toBeInTheDocument();
    expect(screen.getByText(/Surat/i)).toBeInTheDocument();
    expect(screen.getByText(/Buku/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Surat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Galeri/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buku/i })).toBeInTheDocument();

    // Atmosphere button
    const timeBtn = screen.getByTitle(/Ubah Suasana/i);
    expect(timeBtn).toBeInTheDocument();
    fireEvent.click(timeBtn);
    expect(handleToggleTime).toHaveBeenCalled();
  });

  it('displays proximity prompt when nearby a landmark', () => {
    const handleOpen = vi.fn();
    const handleTeleport = vi.fn();
    const handleHorn = vi.fn();
    const handleToggleTime = vi.fn();

    render(
      <HUD
        nearbyLandmark={LANDMARKS[0]}
        onOpenLandmark={handleOpen}
        onTeleportTo={handleTeleport}
        onHorn={handleHorn}
        timeOfDay="day"
        onToggleTimeOfDay={handleToggleTime}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
      />
    );

    expect(screen.getByText(LANDMARKS[0].title)).toBeInTheDocument();
    expect(screen.getByText(/Tekan \[E\]/i)).toBeInTheDocument();
  });

  it('triggers onOpenLandmark when dock button is clicked', () => {
    const handleOpen = vi.fn();
    const handleTeleport = vi.fn();
    const handleHorn = vi.fn();
    const handleToggleTime = vi.fn();

    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={handleOpen}
        onTeleportTo={handleTeleport}
        onHorn={handleHorn}
        timeOfDay="day"
        onToggleTimeOfDay={handleToggleTime}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
      />
    );

    const suratBtn = screen.getByText(/Surat/i);
    fireEvent.click(suratBtn);
    expect(handleOpen).toHaveBeenCalledWith('mailbox');

    const scrapbookBtn = screen.getByText(/Buku/i);
    fireEvent.click(scrapbookBtn);
    expect(handleOpen).toHaveBeenCalledWith('scrapbook');
  });
});
