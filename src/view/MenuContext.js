import React, { createContext, useState } from 'react';

import pages from './pages';

export const MenuContext = createContext();

export default function MenuProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(pages[0].id);

  return (
    <MenuContext.Provider value={{ currentPage, setCurrentPage }}>{children}</MenuContext.Provider>
  );
}
