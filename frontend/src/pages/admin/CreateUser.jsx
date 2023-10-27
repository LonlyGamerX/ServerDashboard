import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { UserCreation } from "../../components/API";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CreateUser = () => {
  const navigate = useNavigate();
  const admin = Cookies.get("admin");
  const user = Cookies.get("user");

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminValue, setAdminValue] = useState(false); // State for the admin dropdown

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the CreateUser function from the API with the provided name, email, password, and admin value
      await UserCreation(email, password, name, adminValue);

      // After successful signup, you can redirect the user to the desired page
      navigate("/");
    } catch (error) {
      setErrorMsg("Error occurred during sign up");
      console.log("Error occurred during sign up", error);
    }
  };

  return (
    <div>
      <h1 className="mb-5">Create User</h1>
      {errorMsg && <p className="alert alert-danger w-25">{errorMsg}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="nameCreate"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            id="emailCreate"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="passwordCreate"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicAdmin">
          <Form.Label>Is the user an Admin?</Form.Label>
          <Form.Select
            aria-label="Default select example"
            value={adminValue}
            onChange={(e) => setAdminValue(e.target.value === "true")}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateUser;
