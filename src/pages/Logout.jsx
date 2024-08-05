import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function Logout() {
  const { setIsUserLoggedIn, userLogout } = useContext(UserContext);

  userLogout();

  useEffect(() => {
    setIsUserLoggedIn(false);
  });

  return <Navigate to="/login" />;
}
