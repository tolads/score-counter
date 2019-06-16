import React, { createContext, useEffect, useState } from 'react';

import { auth } from '../api/firebase';

export const UserContext = createContext();

export default function MenuProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => auth.onAuthStateChanged(userProp => setUser(userProp)), []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}
