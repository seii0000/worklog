"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "thanhkthp2710@gmail.com") {
        setAdmin(user);
      } else {
        setAdmin(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminContext);
