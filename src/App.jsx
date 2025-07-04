import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Stats from "./Stats.jsx";
import Landing from "./Landing.jsx";
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
          path="/Landing"
          element={
            !isLoggedIn
              ? <Landing />
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
          path="/:username/Stats"
          element={<Stats />}
        />
        <Route
          path="/Login"
          element={<Login />}
        />
        <Route
          path="/"
          element={<Navigate to="/Landing" replace />}
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
