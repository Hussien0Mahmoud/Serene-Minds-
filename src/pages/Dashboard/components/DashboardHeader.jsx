import React from 'react';
import { Navbar, Container, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaSearch, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../store/userSlice';
import { useSearch } from '../../../context/SearchContext';
import '../../../styles/dashboard/DashboardHeader.css';

export default function DashboardHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { searchTerm, setSearchTerm } = useSearch();

  const handleLogout = () => {
    try {
      // Clear user data from Redux
      dispatch(logoutSuccess());
      // Clear localStorage
      localStorage.removeItem('user');
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Navbar bg="white" className="border-bottom shadow-sm">
      <Container fluid>
        <div className="d-flex align-items-center">
          <Link 
            to="/"
            className="btn btn-link text-dark me-3 d-flex align-items-center"
            style={{ textDecoration: 'none' }}
          >
            <FaHome size={20} />
            <span className="ms-2">Home</span>
          </Link>

          <div className="dashboard-search ms-3" style={{ maxWidth: '400px' }}>
            <InputGroup>
              <InputGroup.Text 
                className="bg-light border-0"
                style={{ 
                  borderRadius: '0.375rem 0 0 0.375rem',
                  position: 'static'
                }}
              >
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="border-0 bg-light ps-2"
                style={{ 
                  boxShadow: 'none',
                  borderRadius: '0 0.375rem 0.375rem 0'
                }}
              />
            </InputGroup>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-dark d-flex align-items-center">
              <FaUserCircle size={24} className="me-2" />
              <span>{currentUser?.name || 'User'}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/dashboard/profile">Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}