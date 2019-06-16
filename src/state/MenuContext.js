import React, { createContext, useState } from 'react';

import { home } from './pageIds';

export const MenuContext = createContext();

export default function MenuProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(home);

  return (
    <MenuContext.Provider value={{ currentPage, setCurrentPage }}>{children}</MenuContext.Provider>
  );
}
