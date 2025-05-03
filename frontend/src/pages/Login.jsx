import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../api/userapi';
import { setError, setLoading, loginSuccess } from '../store/userSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(setLoading(true));
      const response = await loginUser({ email, password });
      console.log(response.data);
      
      if (response.data.length === 0) {
        dispatch(setError('User not found'));
        return;
      }

      const user = response.data[0];
      if (user.password !== password) {
        dispatch(setError('Invalid password'));
        return;
      }

      // Save user data to Redux and localStorage
      dispatch(loginSuccess(user));
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0f9 100%)', minHeight: '100vh', padding: '50px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to your account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaEnvelope className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label="Remember me" />
                    <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#660ff1' }}>
                      Forgot Password?
                    </Link>
                  </div>

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
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-4">Or sign in with</p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                      <Button variant="light" className="d-flex align-items-center gap-2">
                        <FaGoogle /> Google
                      </Button>
                      <Button variant="light" className="d-flex align-items-center gap-2">
                        <FaFacebook /> Facebook
                      </Button>
                    </div>
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-decoration-none" style={{ color: '#660ff1' }}>
                        Sign Up
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