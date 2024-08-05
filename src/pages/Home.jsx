import Banner from "../components/Banner";
import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function Home() {
  const { isUserLoggedIn } = useContext(UserContext);

  const data = {
    title: "Fitness App",
    content:
      "Welcome to Fitness App, your go-to platform for a streamlined fitness experience. Effortlessly add new workouts to track your exercise routine, access a complete list of your activities to monitor progress, and update your workout details as needed. Easily remove workouts you no longer need and mark your exercises as complete to keep your goals on track. Fitness App simplifies managing your fitness journey, helping you stay organized, motivated, and focused on achieving your health and fitness objectives.",
    destination: isUserLoggedIn === false ? "/login" : "/workouts",
    buttonLabel: isUserLoggedIn === false ? "Log In" : "Workouts",
  };

  return <Banner data={data} />;
}
