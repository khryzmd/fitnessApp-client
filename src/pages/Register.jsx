import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

import UserContext from "../context/UserContext";

export default function Register() {
  const { isUserLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  // Disable and enable submit button
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      email !== "" &&
      password !== "" &&
      verifyPassword !== "" &&
      password === verifyPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, verifyPassword]);

  function registerUser(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
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
        console.log(data);

        if (data.message === "Registered Successfully") {
          setEmail("");
          setPassword("");
          setVerifyPassword("");
          alert("Registration succesful");
          navigate("/login");
        } else if (data.error === "Email Invalid") {
          alert("Email is invalid");
        } else if (data.error === "Password must be atleast 8 characters") {
          alert("Password must be at least 8 characters");
        } else {
          alert("Something went wrong");
        }
      });
  }

  return isUserLoggedIn === true ? (
    <Navigate to="/workouts" />
  ) : (
    <Form onSubmit={(e) => registerUser(e)}>
      <h1 className="my-5 text-center">Register</h1>
      <Form.Group>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your Email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Verify Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Verify your password"
          required
          value={verifyPassword}
          onChange={(e) => {
            setVerifyPassword(e.target.value);
          }}
        />
      </Form.Group>

      {isActive ? (
        <Button variant="primary" type="submit" id="submitBtn">
          Submit
        </Button>
      ) : (
        <Button variant="danger" type="submit" id="submitBtn" disabled>
          Submit
        </Button>
      )}
    </Form>
  );
}
