import axios from "axios";

const port = 5333;
const urlendpoint = "http://localhost:" + port;
const aboutEP = "/about";
const loginEP = "/login/login";
const userEP = "/user/admin";

// Generic function to handle API requests
const makeRequest = async (endpoint, method = "get", data = null) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const response = await axios[method](urlendpoint + endpoint, data, config);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const Login = async (email, password) => {
  const requestData = { email, password };
  return await makeRequest(loginEP, "post", JSON.stringify(requestData));
};

export const UserCreation = async (email, password, name, admin) => {
  const requestData = { email, password, name, admin };
  return await makeRequest(userEP, "post", JSON.stringify(requestData));
};
