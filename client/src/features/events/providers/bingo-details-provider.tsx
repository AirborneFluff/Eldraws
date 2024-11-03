import { BingoEventExtras } from '../../../data/entities/bingo-event.ts';
import React, { createContext, useContext } from 'react';

interface BingoDetailsContextProps {
  bingoDetails: BingoEventExtras | null;
  refetch: () => void;
}

const BingoDetailsContext = createContext<BingoDetailsContextProps | undefined>(undefined);

export const BingoDetailsProvider: React.FC<{
  children: React.ReactNode,
  bingoDetails: BingoEventExtras | null,
  refetch: () => void
}> = ({children, bingoDetails, refetch}) => (
  <BingoDetailsContext.Provider value={{bingoDetails, refetch}}>
    {children}
  </BingoDetailsContext.Provider>
);

export const useBingoDetails = (): BingoDetailsContextProps => {
  const context = useContext(BingoDetailsContext);
  if (context === undefined) throw new Error('useEventDetails must be used within an EventDetailsProvider');
  return context;
};