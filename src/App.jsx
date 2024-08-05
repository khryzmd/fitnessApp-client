import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  function userLogout() {
    localStorage.clear();
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    console.log("Is user logged in? " + isUserLoggedIn);
    console.log(localStorage);
  }, [isUserLoggedIn]);

  return (
    <>
      <UserProvider value={{ isUserLoggedIn, setIsUserLoggedIn, userLogout }}>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
