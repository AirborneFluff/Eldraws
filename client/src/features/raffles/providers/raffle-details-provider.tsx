import React, { createContext, useContext } from 'react';
import { RaffleEventExtras } from '../../../data/entities/raffle-event.ts';

interface RaffleDetailsContextProps {
  raffleDetails: RaffleEventExtras | null;
  refetch: () => void;
}

const RaffleDetailsContext = createContext<RaffleDetailsContextProps | undefined>(undefined);

export const RaffleDetailsProvider: React.FC<{
  children: React.ReactNode,
  raffleDetails: RaffleEventExtras | null,
  refetch: () => void
}> = ({children, raffleDetails, refetch}) => (
  <RaffleDetailsContext.Provider value={{raffleDetails, refetch}}>
    {children}
  </RaffleDetailsContext.Provider>
);

export const useRaffleDetails = (): RaffleDetailsContextProps => {
  const context = useContext(RaffleDetailsContext);
  if (context === undefined) throw new Error('useRaffleDetails must be used within a RaffleDetailsProvider');
  return context;
};