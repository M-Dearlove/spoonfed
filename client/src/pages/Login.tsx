import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth.js";
import "../styles/login.css";
import { login } from "../api/authAPI";
import LoginModal from "../components/loginModal.js";
interface LoginData {
  username: string;
  password: string;
}
const Login = () => {
  const [modalShow, setModalShow] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      alert("Both fields are required!");
      return;
    }
    try {
      const data = await login(loginData);
      Auth.login(data.token, loginData.username);
    } catch (err) {
      console.error("Failed to login", err);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label>Username</label>
          <input
            className="usernameForm"
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            className="passwordForm"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />

          <button onClick={() => setModalShow(true)} className="submit" type="submit">Login</button>
          <LoginModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            centered
          />

        </form>
        <p className="register">
          Don't have an account? <Link to="/register"> Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
