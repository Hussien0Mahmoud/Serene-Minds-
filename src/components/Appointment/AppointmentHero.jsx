import React from 'react';
import { Container } from 'react-bootstrap';

export default function AppointmentHero() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0f9 100%)',
      padding: '80px 0'
    }}>
      <Container className="text-center">
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#17254E' }}>
          Schedule Your Session
        </h1>
        <p className="lead mb-0" style={{ color: '#4A5568', maxWidth: '600px', margin: '0 auto' }}>
          Take the first step towards better mental health. Book a session with our licensed therapists.
        </p>
      </Container>
    </div>
  );
}