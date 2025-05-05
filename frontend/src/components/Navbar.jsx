import React, { useEffect } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Changed from fa6 to fa
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate import
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess, loginSuccess } from "../store/userSlice";

import Logo1 from "../assets/images/navbar/logo1.png";
import Logo2 from "../assets/images/navbar/sereneLogo1.png";
import "../assets/css/navbar/style.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {

    const savedUser = localStorage.getItem("user");
    if (savedUser && !currentUser) {
      dispatch(loginSuccess(JSON.parse(savedUser)));
    }
  }, [dispatch, currentUser]);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/");
  };

  return (
    <>
      <Navbar expand="lg" className="bg-dark text-light py-2">
        <Container fluid>
          <Navbar.Brand
            href="/"
            className="ms-3 text-light fw-bold fs-3 d-flex align-items-center"
          >
            <img
              alt=""
              src={Logo2}
              width="125"
              height="75"
              className="d-inline-block align-top pt-3"
            />
            <span>Serene Minds</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbarScroll"
            className="border-0 bg-transparent"
          />

          <Navbar.Collapse
            id="navbarScroll"
            className="justify-content-end me-4 mt-3"
          >
            <Nav className="m-auto">
              <Nav.Link as={Link} to="/about" className="text-light me-3">
                AboutUs
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-light me-3">
                ContactUs
              </Nav.Link>
              <Nav.Link as={Link} to="/appointment" className="text-light me-3">
                Our Therapist
              </Nav.Link>
              <Nav.Link as={Link} to="/resources" className="text-light me-3">
                Resources
              </Nav.Link>
              <Nav.Link as={Link} to="/events" className="text-light me-3">
                events
              </Nav.Link>
            </Nav>

            <Nav className="d-flex align-items-center">
              {isAuthenticated ? (
                <>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-profile"
                      className="nav-link p-0 d-flex align-items-center text-light"
                    >
                      <img
                        src={
                          currentUser.profileImage ||
                          `https://ui-avatars.com/api/?name=${currentUser.name}&background=660ff1&color=fff`
                        }
                        alt={currentUser.name}
                        className="rounded-circle me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "cover",
                        }}
                      />
                      <span className="me-2">{currentUser.name}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      className="shadow-sm"
                      style={{ backgroundColor: "white" }}
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/profile"
                        style={{ color: "#660ff1" }}
                        className="hover-item"
                      >
                        <FaUser className="me-2" />
                        Profile
                      </Dropdown.Item>
                      {currentUser.role === "admin" && (
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard"
                          style={{ color: "#660ff1" }}
                          className="hover-item"
                        >
                          <FaCog className="me-2" />
                          Dashboard
                        </Dropdown.Item>
                      )}
                      <Dropdown.Divider style={{ borderColor: "#660ff115" }} />
                      <Dropdown.Item
                        onClick={handleLogout}
                        style={{ color: "#660ff1" }}
                        className="hover-item"
                      >
                        <FaSignOutAlt className="me-2" />
                        Sign Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="sign-in mx-3 text-decoration-none text-light"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="header-button text-decoration-none"
                    style={{
                      backgroundColor: "#660ff1",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* <Navbar bg="dark" data-bs-theme="dark">
        <Nav className="m-auto">
          <Nav.Link href="/about" className="text-light me-3">AboutUs</Nav.Link>
          <Nav.Link href="/contact" className="text-light me-3">ContactUs</Nav.Link>
          <Nav.Link href="/appointment" className="text-light me-3">Our Therapist</Nav.Link>
          <Nav.Link href="/resources" className="text-light me-3">Resources</Nav.Link>
          <Nav.Link as={Link} to="/events" className="text-light me-3">events</Nav.Link>
        </Nav>
      </Navbar> */}
    </>
  );
}
