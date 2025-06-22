import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
          path="/:username"
          element={<ProtectedRoute />}
        />
        <Route
          path="/Login"
          element={
            !isLoggedIn
              ? <Login />
              : <Navigate to={`/${localStorage.getItem("loggedInUsername")}`} />
          }
        />
        <Route
          path="/SignUp"
          element={!isLoggedIn ? <SignUp /> : <Navigate to={`/${localStorage.getItem("loggedInUsername")}`} />}
        />
        <Route
          path="/ForgotPassword"
          element={<ForgotPassword />}
        />
        <Route
          path="/ResetPassword"
          element={<ResetPassword />}
        />
        <Route
          path="/NotFound"
          element={<NotFound />}
        />
        <Route
          path="/Expense-Data/"
          element={<Navigate to="/Expense-Data/Login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? `/${localStorage.getItem("loggedInUsername")}` : "/NotFound"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
