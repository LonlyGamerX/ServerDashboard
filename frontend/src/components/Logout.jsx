import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigation = useNavigate();

  useEffect(() => {
    // Clear the authentication cookies
    Cookies.remove("user");
    Cookies.remove("name");
    Cookies.remove("admin");

    // Redirect to the home page
    navigation("/");
  }, [navigation]);

  return null; // or you can render a loading indicator if needed
};

export default Logout;
