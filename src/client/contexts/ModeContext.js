import { createContext, useContext } from 'react';

export const ModeContext = createContext();

export const useMode = () => useContext(ModeContext);
