import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../store/userSlice';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    profileImage: currentUser?.profileImage || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      ...formData
    };
    dispatch(loginSuccess(updatedUser));
    setIsEditing(false);
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
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={formData.profileImage || `https://ui-avatars.com/api/?name=${currentUser.name}&background=660ff1&color=fff`}
                      alt={currentUser.name}
                      className="rounded-circle mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    {isEditing && (
                      <div className="position-absolute bottom-0 end-0">
                        <label htmlFor="imageInput" className="btn btn-sm btn-light rounded-circle shadow-sm">
                          <FaCamera />
                          <input
                            type="file"
                            id="imageInput"
                            className="d-none"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <h3 className="mb-1">{currentUser.name}</h3>
                  <p className="text-muted">{currentUser.role}</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaUser className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaEnvelope className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Phone</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaPhone className="text-primary" style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          style={{ backgroundColor: '#660ff1', border: 'none' }}
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        style={{ backgroundColor: '#660ff1', border: 'none' }}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
              <div className="mb-4">
          <Link 
            to="/" 
            className="btn btn-link text-decoration-none"
            style={{ color: '#660ff1' }}
          >
            <FaArrowLeft className="ms-2" />
            Back to Home
          </Link>
        </div>
            </Card>
          </Col>
          
        </Row>
        
      </Container>
    </div>
  );
}