import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaArrowLeft, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { appointmentApi } from '../api/appointmentApi';
import { addAppointment } from '../store/slices/appointmentSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { doctor, selectedDate, selectedTime } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: selectedDate || '',
    time: selectedTime || '',
    message: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create new appointment
      const appointmentData = {
        id: Date.now().toString(),
        userId: currentUser.id,
        therapistId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        status: "Confirmed",
        type: "Video Call",
        notes: formData.message,
        duration: 60,
        payment: {
          amount: doctor.price + 10,
          status: "Paid",
          method: formData.paymentMethod
        }
      };

      // Update doctor's schedule - keep the time but mark it as booked
      const updatedSchedule = { ...doctor.schedule };
      // Instead of filtering out the booked time, we keep it
      // The booked status is tracked through the appointments array

      // Save appointment to db.json
      const appointmentResponse = await appointmentApi.createAppointment(appointmentData);
      
      // Update Redux store
      dispatch(addAppointment(appointmentResponse.data));

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your appointment has been sent successfully!',
        confirmButtonColor: '#660ff1'
      });
      
      // Navigate back to doctor's page
      setTimeout(() => {
        navigate(`/doctor/${appointmentData.therapistId}`);
      }, 500);

    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Error booking appointment:', err);
      
      // Show error message using sweet alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to book appointment. Please try again.',
        confirmButtonColor: '#660ff1'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '50px 0' }}>
      <Container>
        <div className="mb-4">
          <Link 
            to={`/doctor/${doctor?.id}`} 
            className="btn btn-link text-decoration-none"
            style={{ color: '#660ff1' }}
          >
            <FaArrowLeft className="me-2" />
            Back to Doctor Profile
          </Link>
        </div>

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4">Book Your Appointment</h2>
                {doctor && (
                  <div className="text-center mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <h5 className="mt-3 mb-1">{doctor.name}</h5>
                    <p className="text-muted">{doctor.specialty}</p>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <span>
                        <FaCalendarAlt className="me-2" style={{ color: '#660ff1' }} />
                        {selectedDate}
                      </span>
                      <span>
                        <FaClock className="me-2" style={{ color: '#660ff1' }} />
                        {selectedTime}
                      </span>
                    </div>
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaUser style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaEnvelope style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Phone</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaPhone style={{ color: '#660ff1' }} />
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any specific concerns or questions?"
                      style={{ backgroundColor: '#f8f9fa', border: 'none' }}
                    />
                  </Form.Group>

                  <hr className="my-4" />

                  <h5 className="mb-4">Payment Details</h5>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Payment Method</Form.Label>
                    <div className="d-flex gap-3 mb-3">
                      <div
                        className={`payment-option p-3 rounded border ${
                          formData.paymentMethod === 'credit-card' ? 'border-primary' : ''
                        }`}
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: formData.paymentMethod === 'credit-card' ? '#f8f0ff' : '#fff'
                        }}
                        onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'credit-card' } })}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <FaCreditCard style={{ color: '#660ff1' }} />
                          <span>Credit Card</span>
                        </div>
                      </div>
                      <div
                        className={`payment-option p-3 rounded border ${
                          formData.paymentMethod === 'paypal' ? 'border-primary' : ''
                        }`}
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: formData.paymentMethod === 'paypal' ? '#f8f0ff' : '#fff'
                        }}
                        onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'paypal' } })}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <FaPaypal style={{ color: '#660ff1' }} />
                          <span>PayPal</span>
                        </div>
                      </div>
                    </div>
                  </Form.Group>

                  {formData.paymentMethod === 'credit-card' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0">
                            <FaCreditCard style={{ color: '#660ff1' }} />
                          </span>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                            required={formData.paymentMethod === 'credit-card'}
                          />
                        </div>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                              required={formData.paymentMethod === 'credit-card'}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleChange}
                              style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '12px 20px' }}
                              required={formData.paymentMethod === 'credit-card'}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Session Fee</span>
                      <span>${doctor?.price || 120}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Service Fee</span>
                      <span>$10</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <strong>Total</strong>
                      <strong>${(doctor?.price || 120) + 10}</strong>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger mb-3">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-100 py-3"
                    style={{ backgroundColor: '#660ff1', border: 'none' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      'Pay and Confirm Appointment'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}