import { useParams, Navigate } from "react-router-dom";
import CRUD from "./CRUD";

function ProtectedRoute() {
  const { username } = useParams();
  const loggedInUsername = localStorage.getItem("loggedInUsername");

  if (username !== loggedInUsername) {
    return <Navigate to="/Expense-Data/Login" />;
  }

  return <CRUD />;
}

export default ProtectedRoute