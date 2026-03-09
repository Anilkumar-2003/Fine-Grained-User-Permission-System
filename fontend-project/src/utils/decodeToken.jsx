import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
};