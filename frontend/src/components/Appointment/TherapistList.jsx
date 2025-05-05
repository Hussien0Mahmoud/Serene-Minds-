import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import { FaStar, FaVideo, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTherapists, setLoading, setError } from '../../store/slices/therapistSlice';
import { therapistApi } from '../../api/api';

export default function TherapistList({ onViewSchedule }) {
  const dispatch = useDispatch();
  const { therapists, loading, error } = useSelector(state => state.therapists);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    if (!therapists || therapists.length === 0) {
      fetchTherapists();
    }
    console.log( therapists);
  }, [therapists]);

  const fetchTherapists = async () => {
    try {
      dispatch(setLoading(true));
      const response = await therapistApi.getAllTherapists();

      const therapistsData = response.data.results || [];
      
      const transformedData = therapistsData.map(therapist => ({
        id: therapist.id,
        name: therapist.user.username,
        email: therapist.user.email,
        specialty: therapist.specialty,
        experience: `${therapist.experience} years`,
        availability: therapist.availability,
        price: parseFloat(therapist.price),
        languages: Array.isArray(therapist.languages) ? therapist.languages : [therapist.languages],
        specializations: Array.isArray(therapist.specializations) ? therapist.specializations : [therapist.specializations],
        education: Array.isArray(therapist.education) ? therapist.education : [therapist.education],
        about: therapist.about,
        rating: parseFloat(therapist.rating),
        reviews: therapist.reviews_count,
        image: therapist.user.profile_image,
        time_slots: therapist.time_slots
      }));

      dispatch(setTherapists(transformedData));
    } catch (error) {
      dispatch(setError('Failed to fetch therapists'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getSpecialtyOptions = () => {
    if (!Array.isArray(therapists)) {
      return [];
    }
    
    const specialties = new Set();
    therapists.forEach(therapist => {
      if (therapist.specialty) specialties.add(therapist.specialty);
    });
    return Array.from(specialties);
  };

  const filteredTherapists = selectedSpecialty === 'all' 
    ? (Array.isArray(therapists) ? therapists : [])
    : (Array.isArray(therapists) ? therapists.filter(therapist => 
        therapist.specialty === selectedSpecialty
      ) : []);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Our Therapists</h2>
        <Form.Select 
          style={{ width: 'auto' }}
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="all">All Specialties</option>
          {getSpecialtyOptions().map((specialty, index) => (
            <option key={index} value={specialty}>{specialty}</option>
          ))}
        </Form.Select>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {filteredTherapists.map((therapist) => (
            <Col key={therapist.id} md={6} lg={4} className="d-flex">
              <Card className="h-100 border-0 shadow-sm w-100">
                <Card.Body className="d-flex flex-column">

                  <div className="text-center mb-3">
                    <img
                      src={therapist.image || `https://ui-avatars.com/api/?name=${therapist.name}`}
                      alt={therapist.name}
                      className="rounded-circle"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h5 className="mt-3 mb-1">{therapist.name}</h5>
                    <p className="text-muted mb-2">{therapist.specialty}</p>
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                      <FaStar className="text-warning" />
                      <span className="fw-bold">{therapist.rating || '0.0'}</span>
                      <span className="text-muted">({therapist.reviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <div className="mb-3">
                      {therapist.specializations?.map((specialization, index) => (
                        <Badge 
                          key={index} 
                          className="me-2 mb-2"
                          style={{ backgroundColor: '#6600f1' }}
                        >
                          {specialization}
                        </Badge>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="text-end">
                        <small className="text-muted d-block">Experience
                        <small className="text-success ms-3 fw-bold">{therapist.experience}</small></small>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">${therapist.price || 0}/session</span>
                      <Link to={`/doctor/${therapist.id}`}>
                        <Button 
                          variant="outline-primary"
                          style={{ 
                            borderColor: '#6600f1', 
                            color: '#6600f1',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#6600f1';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6600f1';
                          }}
                        >
                          <FaCalendarAlt className="me-2" />
                          View Schedule
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}