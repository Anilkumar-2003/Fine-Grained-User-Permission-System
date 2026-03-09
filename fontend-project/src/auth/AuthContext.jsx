import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { getUserFromToken } from "../utils/decodeToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [user, setUser] = useState(null);

  const loadPermissions = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    const user_id = getUserFromToken(token);

    try {
      const res = await axiosInstance.get(
        `/api/my-permissions/?user_id=${user_id}`
      );

      setPermissions(res.data.permissions);
      setUser(user_id);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  return (
    <AuthContext.Provider value={{ permissions, user, loadPermissions }}>
      {children}
    </AuthContext.Provider>
  );
};