import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaStar, FaVideo, FaPhoneAlt, FaUserMd, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { therapistApi } from '../api/api';
import axios from 'axios';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchDoctorAndAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        const [doctorRes, appointmentsRes] = await Promise.all([
          therapistApi.getTherapistById(id),
          axios.get('http://localhost:8000/api/appointments/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (doctorRes.data) {
          setDoctor(doctorRes.data);
          
          const doctorAppointments = appointmentsRes.data.results.filter(
            app => app.therapist === parseInt(id) && app.status !== 'Cancelled'
          );
          
          const booked = doctorAppointments.map(app => `${app.date}-${app.time}`);
          setBookedSlots(booked);
        } else {
          setError('Therapist not found');
        }
      } catch (err) {
        setError('Failed to fetch therapist details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorAndAppointments();
    }
  }, [id]);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    navigate('/book-appointment', {
      state: {
        doctor,
        selectedDate,
        selectedTime
      }
    });
  };

  const isTimeSlotBooked = (date, time) => {
    return bookedSlots.includes(`${date}-${time}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        {error || 'Therapist not found'}
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>

        <Card 
          className="border-0 mb-4" 
          style={{ 
            boxShadow: 'rgba(102, 15, 241, 1) 0px 10px 50px',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <Card.Body className="p-4">
            <Row>
              <Col md={3}>
                <img
                  src={doctor.user.profile_image || `https://ui-avatars.com/api/?name=${doctor.user.username}`}
                  alt={doctor.user.username}
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={9}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h2 className="mb-1">{doctor.user.username}</h2>
                    <p className="text-muted mb-2">{doctor.specialty}</p>
                    <div className="d-flex align-items-center mb-3">
                      <FaStar className="text-warning me-1" />
                      <span className="fw-bold me-2">{doctor.rating}</span>
                      <span className="text-muted">({doctor.reviews_count} reviews)</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="d-flex align-items-center gap-2">
                      <FaVideo /> Video Call
                    </Button>
                    <Button variant="outline-primary" className="d-flex align-items-center gap-2">
                      <FaPhoneAlt /> Audio Call
                    </Button>
                  </div>
                </div>

                <hr />

                <Row>
                  <Col md={4}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Experience</small>
                      <span className="fw-bold">{doctor.experience} years</span>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Languages</small>
                      <span className="fw-bold">{doctor.languages}</span>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <small className="text-muted d-block">Session Fee</small>
                      <span className="fw-bold">${doctor.price}/hour</span>
                    </div>
                  </Col>
                </Row>

                <div className="mt-2">
                  {doctor.specializations && (
                    <Badge 
                      className="me-2 mb-2"
                      style={{ backgroundColor: '#660ff1' }}
                    >
                      {doctor.specializations}
                    </Badge>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card 
          className="border-0 mb-4" 
          style={{ 
            boxShadow: 'rgba(102, 15, 241, 0.25) 0px 10px 50px',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-3">About</h4>
            <p>{doctor.about}</p>
            
            <h5 className="mb-3 mt-4">Education</h5>
            <ul className="list-unstyled">
              {doctor.education && (
                <li className="mb-2">
                  <FaUserMd className="me-2 text-primary" />
                  {doctor.education}
                </li>
              )}
            </ul>
          </Card.Body>
        </Card>

        <Card 
          className="border-0 mb-4" 
          style={{ 
            boxShadow: 'rgba(102, 15, 241, 0.25) 0px 10px 50px',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4">Weekly Schedule</h4>
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-2 mb-4">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDate === day ? "primary" : "outline-primary"}
                    onClick={() => handleDateSelect(day)}
                    className="d-flex align-items-center gap-2"
                    style={{ 
                      backgroundColor: selectedDate === day ? '#660ff1' : 'white',
                      borderColor: '#660ff1',
                      color: selectedDate === day ? 'white' : '#660ff1'
                    }}
                  >
                    <FaCalendarAlt />
                    {day}
                  </Button>
                ))}
              </div>

              {selectedDate && (
                <div>
                  <h5 className="mb-3">Available Slots for {selectedDate}</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {doctor.time_slots && doctor.time_slots.length > 0 ? (
                      doctor.time_slots
                        .filter(slot => slot.day === selectedDate) 
                        .map((slot) => {
                          const isBooked = isTimeSlotBooked(selectedDate, slot.time);
                          return (
                            <Button
                              key={slot.id}
                              variant={selectedTime === slot.time ? "primary" : "outline-primary"}
                              onClick={() => !isBooked && handleTimeSelect(slot.time)}
                              className="d-flex align-items-center gap-2"
                              style={{ 
                                backgroundColor: isBooked ? '#e9ecef' : 
                                                 selectedTime === slot.time ? '#660ff1' : 'white',
                                borderColor: isBooked ? '#dee2e6' : '#660ff1',
                                color: isBooked ? '#6c757d' : 
                                       selectedTime === slot.time ? 'white' : '#660ff1',
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                opacity: isBooked ? 0.65 : 1,
                                textDecoration: isBooked ? 'line-through' : 'none',
                                border: isBooked ? '2px dashed #dee2e6' : undefined
                              }}
                              disabled={isBooked || !slot.is_available}
                            >
                              <FaClock />
                              {slot.time}
                              {isBooked && <span className="ms-1 small">(Booked)</span>}
                            </Button>
                          );
                        })
                    ) : (
                      <p className="text-muted">No available slots for this day</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedDate && selectedTime && (
              <Button 
                className="w-100 mt-3"
                style={{ backgroundColor: '#660ff1', border: 'none' }}
                onClick={handleBookAppointment}
              >
                Book Appointment for {selectedDate} at {selectedTime}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Container>
      <div className='text-center mt-5'>
      <Button 
                style={{ backgroundColor: '#660ff1', border: 'none' }} 
                size="lg" 
                className="fw-bold text-white"
              >
                <Link to="/appointment" className="text-white text-decoration-none">
                Back
                </Link>
                
              </Button>
      </div>
    </div>
  );
}