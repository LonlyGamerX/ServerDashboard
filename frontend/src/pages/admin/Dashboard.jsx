import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const admin = Cookies.get("admin");
  const user = Cookies.get("user");
  const name = Cookies.get("name");

  // UseEffect to check if user is logged in and has admin privileges
  useEffect(() => {
    const isLoggedIn = !!user;
    const isAdmin = !!admin;

    if (!isLoggedIn) {
      navigate("/login");
    }

    if (!isAdmin) {
      navigate("/notAdmin");
    }
  }, [navigate, user, admin]);

  return (
    <div>
      <h1>Welcome {name}</h1>
      {/* Dashboard content */}
      {/* Create a basic button that has the classes btn and btn-primary that when clicked on it navigates to /admin/createuser */}
      <button
        className="btn btn-primary"
        onClick={() => navigate("/admin/createuser")}
      >
        Create User
      </button>
    </div>
  );
};

export default Dashboard;
