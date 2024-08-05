import { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Button,
  Form,
  Accordion,
  Modal,
} from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import UserContext from "../context/UserContext";

export default function Workouts() {
  const { isUserLoggedIn } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);

  const [workoutId, setWorkoutId] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");

  // Update modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setWorkoutName("");
    setWorkoutDuration("");
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const fetchData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/workouts/getMyWorkouts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.workouts);

        if (data.workouts !== undefined) {
          let workoutData = data.workouts.map((workout) => {
            const formattedDate = format(
              new Date(workout.dateAdded),
              "pp - PP"
            );
            return (
              <Accordion.Item eventKey={workout._id} key={workout._id}>
                <Accordion.Header>
                  {" "}
                  <strong className="me-3">{workout.name}</strong>{" "}
                  {formattedDate}
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    <li>Duration: {workout.duration}</li>
                    <li>Status: {workout.status}</li>
                  </ul>
                  <button
                    className="btn btn-outline-success mx-2"
                    onClick={() => completeWorkout(workout)}
                  >
                    Complete
                  </button>
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => settingUpdates(workout)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-danger mx-2"
                    onClick={() => deleteWorkout(workout)}
                  >
                    Delete
                  </button>
                </Accordion.Body>
              </Accordion.Item>
            );
          });
          setWorkouts(workoutData);
        } else {
          setWorkouts(
            "It looks like you don't have any workouts recorded at the moment. You can start adding your workout routines by filling out the form above. Once you add some workouts, they'll appear here, and you'll be able to manage them easily. Keep track of your progress and stay motivated as you work towards your fitness goals!"
          );
        }
      });
  };

  const addWorkout = (e) => {
    console.log(e);
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/workouts/addWorkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: workoutName,
        duration: workoutDuration,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          alert("Workout Added Successfully");
          setWorkoutName("");
          setWorkoutDuration("");
          fetchData();
        }
      });
  };

  const settingUpdates = (workout) => {
    setWorkoutName(workout.name);
    setWorkoutDuration(workout.duration);
    setWorkoutId(workout._id);
    handleShow();
  };

  const updateWorkout = (e, workoutId) => {
    e.preventDefault();
    fetch(
      `${import.meta.env.VITE_API_URL}/workouts/updateWorkout/${workoutId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: workoutName,
          duration: workoutDuration,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data) {
          alert("Workout Updated Successfully");
          setWorkoutName("");
          setWorkoutDuration("");
          fetchData();
          handleClose();
        }
      });
  };

  const deleteWorkout = (workout) => {
    console.log(workout);
    fetch(
      `${import.meta.env.VITE_API_URL}/workouts/deleteWorkout/${workout._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Workout deleted successfully") {
          alert("Workout deleted successfully");
          fetchData();
        } else {
          console.log("Error deleting data: " + data);
        }
      });
  };

  const completeWorkout = (workout) => {
    console.log(workout);
    fetch(
      `${import.meta.env.VITE_API_URL}/workouts/completeWorkoutStatus/${
        workout._id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Workout status updated successfully") {
          alert("Workout status updated successfully");
          fetchData();
        } else {
          console.log("Error updating status: " + data);
        }
      });
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchData();
    }
  }, [isUserLoggedIn]);

  return localStorage.getItem("token") ? (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={(e) => updateWorkout(e, workoutId)}>
          <Modal.Header closeButton>
            <Modal.Title>Update {workoutName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter workout name"
                autoFocus
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter workout duration"
                autoFocus
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Container>
        <h3 className="mt-5">Add Workout:</h3>
        <Form onSubmit={(e) => addWorkout(e)}>
          <Form.Group className="mb-3" controlId="formWorkoutName">
            <Form.Control
              type="text"
              placeholder="Enter workout name"
              required
              value={show ? "Enter workout name" : workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWorkoutDuration">
            <Form.Control
              type="text"
              placeholder="Enter workout duration (e.g. 15 min)"
              required
              value={
                show ? "Enter workout duration (e.g. 15 min)" : workoutDuration
              }
              onChange={(e) => setWorkoutDuration(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Workout
          </Button>
        </Form>

        <h3 className="mt-5">Your Workouts:</h3>

        <Accordion>{workouts}</Accordion>
      </Container>
    </>
  ) : (
    <Navigate to="/error" />
  );
}
