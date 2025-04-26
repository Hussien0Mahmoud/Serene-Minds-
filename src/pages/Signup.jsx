import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser, checkEmailExists } from '../api/userapi';
import { setError, setLoading, loginSuccess } from '../store/userSlice';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      dispatch(setError('Passwords do not match'));
      return;
    }

    try {
      dispatch(setLoading(true));
      
      // Check if email already exists
      const emailCheck = await checkEmailExists(formData.email);
      if (emailCheck.data.length > 0) {
        dispatch(setError('Email already exists'));
        return;
      }

      // Create new user object
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
        dateJoined: new Date().toISOString(),
        profileImage: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}`
      };

      const response = await addNewUser(newUser);
      // After successful signup, login the user automatically
      dispatch(loginSuccess(response.data));
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0f9 100%)',
      minHeight: '100vh',
      paddingTop: '50px',
      paddingBottom: '50px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join our community of mental health support</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaUser className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaEnvelope className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaPhone className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaLock className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaLock className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  {loading && (
                    <div className="text-center mb-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-100 mb-3"
                    style={{ backgroundColor: '#660ff1', border: 'none', padding: '12px' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Please wait...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-4">Or sign up with</p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                      <Button variant="light" className="d-flex align-items-center gap-2">
                        <FaGoogle /> Google
                      </Button>
                      <Button variant="light" className="d-flex align-items-center gap-2">
                        <FaFacebook /> Facebook
                      </Button>
                    </div>
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none" style={{ color: '#660ff1' }}>
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}