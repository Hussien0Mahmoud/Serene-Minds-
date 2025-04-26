import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserMd, FaStar, FaPlus, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setTherapists, setLoading, setError } from '../../../store/slices/therapistSlice';
import { therapistApi } from '../../../api/api';

const validateTherapist = (data) => {
  const errors = [];
  
  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.specialty?.trim()) errors.push('Specialty is required');
  if (!data.experience?.trim()) errors.push('Experience is required');
  if (!data.price) errors.push('Price is required');
  if (!data.about?.trim()) errors.push('About section is required');
  if (!data.languages?.length) errors.push('At least one language is required');
  if (!data.specializations?.length) errors.push('At least one specialization is required');
  if (!data.education?.length) errors.push('At least one education entry is required');
  
  // Check if schedule exists and has at least one time slot across all days
  const hasTimeSlots = data.schedule && 
    Object.values(data.schedule).some(slots => Array.isArray(slots) && slots.length > 0);
  
  if (!hasTimeSlots) errors.push('At least one time slot must be added to the schedule');
  
  return errors;
};

export default function ManageTherapists() {
  const dispatch = useDispatch();
  const therapistsState = useSelector((state) => state.therapists);
  const { therapists, loading, error } = therapistsState || { therapists: [], loading: false, error: null };
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [newEducation, setNewEducation] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      dispatch(setLoading(true));
      const response = await therapistApi.getAllTherapists();
      dispatch(setTherapists(response.data));
    } catch (error) {
      dispatch(setError('Failed to fetch therapists'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (therapist) => {
    // Ensure schedule has all days initialized
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
      ...therapist.schedule // Spread existing schedule after default values
    };
    
    setSelectedTherapist({
      ...therapist,
      schedule
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this therapist? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        dispatch(setLoading(true));
        await therapistApi.deleteTherapist(id);
        fetchTherapists();
        alert('Therapist deleted successfully!');
      } catch (error) {
        console.error('Error deleting therapist:', error);
        dispatch(setError('Failed to delete therapist. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure schedule is properly structured
    const schedule = {
      Monday: selectedTherapist.schedule?.Monday || [],
      Tuesday: selectedTherapist.schedule?.Tuesday || [],
      Wednesday: selectedTherapist.schedule?.Wednesday || [],
      Thursday: selectedTherapist.schedule?.Thursday || [],
      Friday: selectedTherapist.schedule?.Friday || [],
      Saturday: selectedTherapist.schedule?.Saturday || [],
      Sunday: selectedTherapist.schedule?.Sunday || []
    };

    const therapistData = {
      ...selectedTherapist,
      schedule,
      languages: selectedTherapist.languages || [],
      specializations: selectedTherapist.specializations || [],
      education: selectedTherapist.education || [],
      image: selectedTherapist.image || `https://ui-avatars.com/api/?name=${selectedTherapist.name}`,
      password: selectedTherapist.password || '123456',
      rating: selectedTherapist.rating || 0,
      reviews: selectedTherapist.reviews || 0,
      about: selectedTherapist.about || ''
    };

    const validationErrors = validateTherapist(therapistData);
    if (validationErrors.length > 0) {
      dispatch(setError(validationErrors.join('\n')));
      return;
    }

    try {
      dispatch(setLoading(true));
      if (selectedTherapist.id) {
        await therapistApi.updateTherapist(selectedTherapist.id, therapistData);
      } else {
        await therapistApi.createTherapist(therapistData);
      }
      
      setShowModal(false);
      fetchTherapists();
      alert(selectedTherapist.id ? 'Therapist updated successfully!' : 'New therapist added successfully!');
      
    } catch (error) {
      console.error('Error saving therapist:', error);
      dispatch(setError('Failed to save therapist. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setSelectedTherapist({
        ...selectedTherapist,
        education: [...(selectedTherapist.education || []), newEducation.trim()]
      });
      setNewEducation('');
    }
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...(selectedTherapist.education || [])];
    updatedEducation.splice(index, 1);
    setSelectedTherapist({
      ...selectedTherapist,
      education: updatedEducation
    });
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setSelectedTherapist({
        ...selectedTherapist,
        specializations: [...(selectedTherapist.specializations || []), newSpecialization.trim()]
      });
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (index) => {
    const updatedSpecializations = [...(selectedTherapist.specializations || [])];
    updatedSpecializations.splice(index, 1);
    setSelectedTherapist({
      ...selectedTherapist,
      specializations: updatedSpecializations
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setSelectedTherapist({
        ...selectedTherapist,
        languages: [...(selectedTherapist.languages || []), newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...(selectedTherapist.languages || [])];
    updatedLanguages.splice(index, 1);
    setSelectedTherapist({
      ...selectedTherapist,
      languages: updatedLanguages
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Manage Therapists</h4>
          <Button 
            onClick={() => {
              setSelectedTherapist({
                name: '',
                email: '',
                specialty: '',
                experience: '',
                availability: true,
                price: '',
                languages: [],
                specializations: [],
                education: [],
                about: '',
                schedule: {
                  Monday: [],
                  Tuesday: [],
                  Wednesday: [],
                  Thursday: [],
                  Friday: [],
                  Saturday: [],
                  Sunday: []
                }
              });
              setShowModal(true);
            }}
            style={{ backgroundColor: '#660ff1', border: 'none' }}
          >
            Add New Therapist
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Therapist</th>
                  <th>Specialty</th>
                  <th>Rating</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map((therapist) => (
                  <tr key={therapist.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={therapist.image || `https://ui-avatars.com/api/?name=${therapist.name}`}
                          alt={therapist.name}
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{therapist.name}</div>
                          <small className="text-muted">{therapist.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{therapist.specialty}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        {therapist.rating}
                      </div>
                    </td>
                    <td>{therapist.experience}</td>
                    <td>
                      <Badge bg={therapist.availability ? "success" : "warning"}>
                        {therapist.availability ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        onClick={() => handleEdit(therapist)}
                      >
                        <FaEdit className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDelete(therapist.id)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTherapist?.id ? 'Edit Therapist' : 'Add New Therapist'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedTherapist?.name || ''}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      name: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedTherapist?.email || ''}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      email: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedTherapist?.specialty || ''}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      specialty: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedTherapist?.experience || ''}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      experience: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>About</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedTherapist?.about || ''}
                onChange={(e) => setSelectedTherapist({
                  ...selectedTherapist,
                  about: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              <div className="mb-2">
                {selectedTherapist?.education?.map((edu, index) => (
                  <Badge 
                    key={index} 
                    className="me-2 mb-2 p-2"
                    bg="light"
                    text="dark"
                  >
                    {edu}
                    <FaTimes 
                      className="ms-2 cursor-pointer" 
                      onClick={() => handleRemoveEducation(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education"
                />
                <Button 
                  onClick={handleAddEducation}
                  variant="outline-primary"
                >
                  <FaPlus />
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specializations</Form.Label>
              <div className="mb-2">
                {selectedTherapist?.specializations?.map((spec, index) => (
                  <Badge 
                    key={index} 
                    className="me-2 mb-2 p-2"
                    style={{ backgroundColor: '#660ff1' }}
                  >
                    {spec}
                    <FaTimes 
                      className="ms-2 cursor-pointer" 
                      onClick={() => handleRemoveSpecialization(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization"
                />
                <Button 
                  onClick={handleAddSpecialization}
                  variant="outline-primary"
                >
                  <FaPlus />
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Languages</Form.Label>
              <div className="mb-2">
                {selectedTherapist?.languages?.map((lang, index) => (
                  <Badge 
                    key={index} 
                    className="me-2 mb-2 p-2"
                    bg="secondary"
                  >
                    {lang}
                    <FaTimes 
                      className="ms-2 cursor-pointer" 
                      onClick={() => handleRemoveLanguage(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add language"
                />
                <Button 
                  onClick={handleAddLanguage}
                  variant="outline-primary"
                >
                  <FaPlus />
                </Button>
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price per Session ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedTherapist?.price || ''}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      price: parseInt(e.target.value)
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    label="Active"
                    checked={selectedTherapist?.availability || false}
                    onChange={(e) => setSelectedTherapist({
                      ...selectedTherapist,
                      availability: e.target.checked
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Weekly Schedule</Form.Label>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="mb-3">
                  <Form.Label className="d-flex justify-content-between align-items-center">
                    <span>{day}</span>
                    <Button
                      variant="link"
                      className="p-0 text-primary"
                      onClick={() => {
                        const newTime = prompt('Enter time (format: HH:mm)', '09:00');
                        if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
                          setSelectedTherapist({
                            ...selectedTherapist,
                            schedule: {
                              ...selectedTherapist.schedule,
                              [day]: [...(selectedTherapist.schedule?.[day] || []), newTime].sort()
                            }
                          });
                        }
                      }}
                    >
                      <FaPlus /> Add Time Slot
                    </Button>
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedTherapist?.schedule?.[day]?.map((time, index) => (
                      <Badge 
                        key={index} 
                        className="p-2"
                        bg="light"
                        text="dark"
                      >
                        {time}
                        <FaTimes 
                          className="ms-2 cursor-pointer" 
                          onClick={() => {
                            const updatedSchedule = { ...selectedTherapist.schedule };
                            updatedSchedule[day] = updatedSchedule[day].filter((_, i) => i !== index);
                            setSelectedTherapist({
                              ...selectedTherapist,
                              schedule: updatedSchedule
                            });
                          }}
                        />
                      </Badge>
                    ))}
                    {(!selectedTherapist?.schedule?.[day] || selectedTherapist.schedule[day].length === 0) && (
                      <span className="text-muted">No time slots added</span>
                    )}
                  </div>
                </div>
              ))}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#660ff1', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}