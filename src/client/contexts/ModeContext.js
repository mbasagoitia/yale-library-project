import { createContext, useContext } from 'react';

export const ModeContext = createContext({
    setMode: () => {},
    setData: () => {}
  });
  
  export const useMode = () => useContext(ModeContext);