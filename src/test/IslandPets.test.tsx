import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PetInteractionModal } from '../components/modals/PetInteractionModal';
import { HUD } from '../components/ui/HUD';
import { TreasureShard } from '../types';

const mockShards: TreasureShard[] = [
  { id: 1, title: 'Permata #1', position: [0, 1, 5], isCollected: false, hint: 'Taman', color: '#ff4d6d' },
];

describe('Free-roaming Pets (Cat & Dog) & Interaction System', () => {
  it('renders PetInteractionModal for Cat with petting, feeding and playing interactions', () => {
    const handleClose = vi.fn();
    render(<PetInteractionModal isOpen={true} onClose={handleClose} petType="cat" />);

    expect(screen.getByText(/Si Meong Manis/i)).toBeInTheDocument();
    expect(screen.getByText(/Kucing oren manja kesayangan Mba Sore/i)).toBeInTheDocument();

    // 1. Petting the cat
    const petBtn = screen.getByRole('button', { name: /Elus Bulu/i });
    fireEvent.click(petBtn);
    expect(screen.getByText(/Si Meong mendengkur puas/i)).toBeInTheDocument();

    // 2. Feeding fish to the cat
    const feedBtn = screen.getByRole('button', { name: /Beri Ikan/i });
    fireEvent.click(feedBtn);
    expect(screen.getByText(/Ikan segar hasil pancingan di dermaga/i)).toBeInTheDocument();

    // 3. Playing with wool yarn
    const playBtn = screen.getByRole('button', { name: /Main Benang/i });
    fireEvent.click(playBtn);
    expect(screen.getByText(/menerkam gulungan benang pink/i)).toBeInTheDocument();

    // 4. Close modal
    const closeBtn = screen.getByRole('button', { name: /Lanjut Jalan-Jalan/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders PetInteractionModal for Dog with petting, feeding and ball fetch interactions', () => {
    const handleClose = vi.fn();
    render(<PetInteractionModal isOpen={true} onClose={handleClose} petType="dog" />);

    expect(screen.getByText(/Si Husky Ceria/i)).toBeInTheDocument();
    expect(screen.getByText(/Anjing Siberian Husky bermata biru setia Mba Sore/i)).toBeInTheDocument();

    // 1. Petting the dog
    const petBtn = screen.getByRole('button', { name: /Elus Kepala/i });
    fireEvent.click(petBtn);
    expect(screen.getByText(/Si Husky berguling santai di rumput/i)).toBeInTheDocument();

    // 2. Feeding biscuit bone to dog
    const feedBtn = screen.getByRole('button', { name: /Beri Biskuit/i });
    fireEvent.click(feedBtn);
    expect(screen.getByText(/Biskuit tulang renyah langsung ludes/i)).toBeInTheDocument();

    // 3. Throwing tennis ball
    const playBtn = screen.getByRole('button', { name: /Lempar Bola/i });
    fireEvent.click(playBtn);
    expect(screen.getByText(/melempar bola tenis dan Si Husky melesat/i)).toBeInTheDocument();
  });

  it('renders HUD pet buttons when near cat and dog, and triggers modal', () => {
    const handleOpenPet = vi.fn();
    const { rerender } = render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
        travelMode="walking"
        isNearCat={true}
        isNearDog={false}
        onOpenPetModal={handleOpenPet}
      />
    );

    // Cat button appears
    const catBtn = screen.getByText(/Elus Si Meong/i);
    expect(catBtn).toBeInTheDocument();
    fireEvent.click(catBtn);
    expect(handleOpenPet).toHaveBeenCalledWith('cat');

    // Dog button appears when near dog
    rerender(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="sunset"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
        travelMode="walking"
        isNearCat={false}
        isNearDog={true}
        onOpenPetModal={handleOpenPet}
      />
    );

    const dogBtn = screen.getByText(/Ajak Main Si Husky/i);
    expect(dogBtn).toBeInTheDocument();
    fireEvent.click(dogBtn);
    expect(handleOpenPet).toHaveBeenCalledWith('dog');
  });
});
