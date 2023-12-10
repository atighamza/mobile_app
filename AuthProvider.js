import React, { useState } from "react";
export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {
  const [currentUserID, setCurrentUserID] = useState(null);
  return (
    <AuthContext.Provider value={{ currentUserID, setCurrentUserID }}>
      {children}
    </AuthContext.Provider>
  );
}
