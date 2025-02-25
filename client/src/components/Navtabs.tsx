import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useState } from "react";
import "../styles/navtabs.css";

const Navigation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isHovered5, setIsHovered5] = useState(false);
  const [isHovered6, setIsHovered6] = useState(false);
  const token = localStorage.getItem("id_token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("username");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <Navbar className="navbar custom-navbar" collapseOnSelect expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to={"/"}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            color: isHovered ? "#794494" : "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            backgroundColor: isHovered ? "#F4E0FD" : "transparent",
          }}
        >
          Spoon Fed
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav
            className="ms-auto"
            style={{
              color: "white",
              fontSize: "1.3rem"
            }}
          >
            {/* Homepage Link */}
            <Nav.Link
              as={Link}
              to="/"
              onMouseEnter={() => setIsHovered2(true)}
              onMouseLeave={() => setIsHovered2(false)}
              style={{
                color: isHovered2 ? "#794494" : "white",
                fontSize: "1.3rem",
                backgroundColor: isHovered2 ? "#F4E0FD" : "transparent",
              }}
            >
              Home
            </Nav.Link>
            {/* Ingredient Page */}
            <Nav.Link
              as={Link}
              to="/ingredient-page"
              onMouseEnter={() => setIsHovered3(true)}
              onMouseLeave={() => setIsHovered3(false)}
              style={{
                color: isHovered3 ? "#794494" : "white",
                fontSize: "1.3rem",
                backgroundColor: isHovered3 ? "#F4E0FD" : "transparent",
              }}
            >
              Ingredient Search
            </Nav.Link>
            {token ? (
              <>
                {/* Profile Link */}
                <Nav.Link
                  as={Link}
                  to="/profile"
                  onMouseEnter={() => setIsHovered4(true)}
                  onMouseLeave={() => setIsHovered4(false)}
                  style={{
                    color: isHovered4 ? "#794494" : "white",
                    fontSize: "1.3rem",
                    backgroundColor: isHovered4 ? "#F4E0FD" : "transparent",
                  }}
                >
                  Profile
                </Nav.Link>
                {/* Logout Link */}
                <Nav.Link
                  as={Link}
                  to="#"
                  onMouseEnter={() => setIsHovered5(true)}
                  onMouseLeave={() => setIsHovered5(false)}
                  style={{
                    color: isHovered5 ? "#794494" : "white",
                    fontSize: "1.3rem",
                    backgroundColor: isHovered5 ? "#F4E0FD" : "transparent",
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    handleLogout(); // Call logout function
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              //Login Link
              <Nav.Link
                as={Link}
                to="/login"
                onMouseEnter={() => setIsHovered6(true)}
                onMouseLeave={() => setIsHovered6(false)}
                style={{
                  color: isHovered6 ? "#794494" : "white",
                  fontSize: "1.3rem",
                  backgroundColor: isHovered6 ? "#F4E0FD" : "transparent",
                }}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
};

export default Navigation;
