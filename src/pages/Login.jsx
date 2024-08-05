import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../context/UserContext";

export default function Login() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Disable and enable submit button
  const [isActive, setIsActive] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function authenticate(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access !== undefined) {
          console.log(data.access);
          localStorage.setItem("token", data.access);

          setEmail("");
          setPassword("");
          setIsUserLoggedIn(true);

          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "You are now logged in.",
          });
        } else if (data.message == "Incorrect email or password") {
          Swal.fire({
            title: "Login Failed",
            icon: "error",
            text: "Incorrect email or password.",
          });
        } else {
          Swal.fire({
            title: "User Not Found",
            icon: "error",
            text: `${email} does not exist.`,
          });
        }
      });
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return isUserLoggedIn === true ? (
    <Navigate to="/workouts" />
  ) : (
    <Form onSubmit={(e) => authenticate(e)}>
      <h1 className="my-5 text-center">Login</h1>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      {isActive ? (
        <Button variant="primary" type="submit" id="loginBtn">
          Login
        </Button>
      ) : (
        <Button variant="danger" type="submit" id="loginBtn" disabled>
          Login
        </Button>
      )}
    </Form>
  );
}
