import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Components
import Navigation from "./components/Navigation";
import AdminNavigation from "./components/AdminNavigation";
import LoginNavigation from "./components/LoginNavigation";
import Logout from "./components/Logout";

// Pages
import Home from "./pages/Home";
import LoginUser from "./pages/LoginUser";
import Error404 from "./pages/Error404";
import NotAdmin from "./pages/NotAdmin";

// Admin pages
import CreateUser from "./pages/admin/CreateUser";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const admin = Cookies.get("admin");
  const logIn = Cookies.get("user");
  const [user, setUser] = useState(logIn);
  const [IsAdmin, setIsAdmin] = useState(true);

  // useEffect(() => {
  //   setUser(Cookies.get("user"));
  //   setIsAdmin(Cookies.get("admin"));
  // }, []);

  useEffect(() => {
    if (!logIn) {
      setUser(false);
    }

    if (!admin) {
      setIsAdmin(false);
    }
  }, [admin, logIn]);

  return (
    <div className="App">
      <Router>
        {IsAdmin ? (
          <AdminNavigation />
        ) : user ? (
          <LoginNavigation />
        ) : (
          <Navigation />
        )}
        <section>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route
              path="/login"
              element={<LoginUser setUser={setUser} setIsAdmin={setIsAdmin} />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/notAdmin" element={<NotAdmin />} />
            {/* Admin Sites */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/createuser" element={<CreateUser />} />
            {/* Error Page */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </section>
      </Router>
    </div>
  );
}

export default App;
