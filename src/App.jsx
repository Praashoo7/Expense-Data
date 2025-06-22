import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import NotFound from "./NotFound.jsx";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("loggedInUsername")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem("loggedInUsername");
      setIsLoggedIn(!!user);
    }, 500); // recheck every 500ms in case login/logout changed localStorage

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/Expense-Data/:username"
          element={<ProtectedRoute />}
        />
        <Route
          path="/Expense-Data/Login"
          element={
            !isLoggedIn
              ? <Login />
              : <Navigate to={`/Expense-Data/${localStorage.getItem("loggedInUsername")}`} />
          }
        />
        <Route
          path="/Expense-Data/SignUp"
          element={!isLoggedIn ? <SignUp /> : <Navigate to={`/Expense-Data/${localStorage.getItem("loggedInUsername")}`} />}
        />
        <Route
          path="/Expense-Data/ForgotPassword"
          element={<ForgotPassword />}
        />
        <Route
          path="/Expense-Data/ResetPassword"
          element={<ResetPassword />}
        />
        <Route
          path="/Expense-Data/NotFound"
          element={<NotFound />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? `/Expense-Data/${localStorage.getItem("loggedInUsername")}` : "/Expense-Data/NotFound"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
