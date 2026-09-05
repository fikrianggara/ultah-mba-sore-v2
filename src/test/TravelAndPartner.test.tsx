import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HUD } from '../components/ui/HUD';
import { TreasureShard } from '../types';

const mockShards: TreasureShard[] = [
  { id: 1, title: 'Permata Cinta #1', position: [0, 1, 5], isCollected: false, hint: 'Di dekat dermaga', color: '#ff4d6d' },
];

describe('TravelMode & Partner HUD Controls', () => {
  it('renders "Turun dari Mobil" button when travelMode is car and dismounts to walking', () => {
    const handleChangeMode = vi.fn();
    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 5]}
        carPos={[0, 0.06, 5]}
        travelMode="car"
        onChangeTravelMode={handleChangeMode}
      />
    );

    const dismountBtn = screen.getByText(/Turun dari Mobil/i);
    expect(dismountBtn).toBeInTheDocument();
    fireEvent.click(dismountBtn);
    expect(handleChangeMode).toHaveBeenCalledWith('walking');
  });

  it('renders "Turun dari Motor" button when travelMode is motor', () => {
    const handleChangeMode = vi.fn();
    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[3, 0.06, 2]}
        motorPos={[3, 0.06, 2]}
        travelMode="motor"
        onChangeTravelMode={handleChangeMode}
      />
    );

    const dismountBtn = screen.getByText(/Turun dari Motor/i);
    expect(dismountBtn).toBeInTheDocument();
    fireEvent.click(dismountBtn);
    expect(handleChangeMode).toHaveBeenCalledWith('walking');
  });

  it('renders "Naik Mobil" when walking near car, and "Naik Motor" when near motor', () => {
    const handleChangeMode = vi.fn();
    render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0.5, 0.06, 5]}
        carPos={[0, 0.06, 5]}
        motorPos={[15, 0.06, 15]}
        travelMode="walking"
        onChangeTravelMode={handleChangeMode}
      />
    );

    const mountCarBtn = screen.getByText(/Naik Mobil/i);
    expect(mountCarBtn).toBeInTheDocument();
    fireEvent.click(mountCarBtn);
    expect(handleChangeMode).toHaveBeenCalledWith('car');
  });

  it('handles "Lepas Gandengan" and "Panggil Mas Jo" partner state flow', () => {
    const handleChangePartnerState = vi.fn();
    const handleCallMasJo = vi.fn();

    // 1. Holding hands: can release
    const { rerender } = render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[5, 0.06, 5]}
        travelMode="walking"
        partnerState="holding_hands"
        onChangePartnerState={handleChangePartnerState}
        onCallMasJo={handleCallMasJo}
      />
    );

    const releaseBtn = screen.getByText(/Lepas Gandengan/i);
    expect(releaseBtn).toBeInTheDocument();
    fireEvent.click(releaseBtn);
    expect(handleChangePartnerState).toHaveBeenCalledWith('roaming');

    // 2. Roaming: can call Mas Jo
    rerender(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[5, 0.06, 5]}
        travelMode="walking"
        partnerState="roaming"
        onChangePartnerState={handleChangePartnerState}
        onCallMasJo={handleCallMasJo}
      />
    );

    const callBtn = screen.getByText(/Panggil Mas Jo/i);
    expect(callBtn).toBeInTheDocument();
    fireEvent.click(callBtn);
    expect(handleCallMasJo).toHaveBeenCalled();
  });

  it('triggers fireworks and supports opening camera tour skip', () => {
    const handleFireworks = vi.fn();
    const handleSkipTour = vi.fn();
    const handleStartTour = vi.fn();

    const { rerender } = render(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]} // At Cake Plaza
        onTriggerFireworks={handleFireworks}
        onStartTour={handleStartTour}
        onSkipTour={handleSkipTour}
        isCinematicTour={false}
      />
    );

    const fireworksBtn = screen.getByText(/Nyalakan Kembang Api/i);
    expect(fireworksBtn).toBeInTheDocument();
    fireEvent.click(fireworksBtn);
    expect(handleFireworks).toHaveBeenCalled();

    // Tour mode overlay
    rerender(
      <HUD
        nearbyLandmark={null}
        onOpenLandmark={vi.fn()}
        onHorn={vi.fn()}
        timeOfDay="day"
        onToggleTimeOfDay={vi.fn()}
        shards={mockShards}
        playerPos={[0, 0.06, 0]}
        onTriggerFireworks={handleFireworks}
        onStartTour={handleStartTour}
        onSkipTour={handleSkipTour}
        isCinematicTour={true}
      />
    );

    const skipBtn = screen.getByText(/Lewati Tour/i);
    expect(skipBtn).toBeInTheDocument();
    fireEvent.click(skipBtn);
    expect(handleSkipTour).toHaveBeenCalled();
  });
});
