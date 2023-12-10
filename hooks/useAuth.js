import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider";
export default function useAuth() {
  const { currentUserID, setCurrentUserID } = useContext(AuthContext);

  return [currentUserID, setCurrentUserID];
}
