import React from 'react';
import { Container, Row, Col, Carousel, Card, Badge } from 'react-bootstrap';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import '../../styles/home/testimonials.css';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Anxiety Support Group Member",
      text: "The online counseling sessions have been life-changing. My therapist helped me develop effective coping strategies for anxiety. I'm grateful for this platform.",
      image: "https://i.pravatar.cc/150?img=1",
      stars: 5
    },
    {
      name: "David R.",
      role: "Depression Recovery Journey",
      text: "Finding support here was the first step in my recovery journey. The therapists are compassionate and professional. I finally feel understood and supported.",
      image: "https://i.pravatar.cc/150?img=2",
      stars: 5
    },
    {
      name: "Emily L.",
      role: "Stress Management Program",
      text: "The stress management workshops and one-on-one sessions helped me balance my work and personal life. I've learned valuable techniques for mindfulness.",
      image: "https://i.pravatar.cc/150?img=3",
      stars: 5
    }
  ];

  return (
    <div className="bg-light py-4">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 className="heat-title fw-bold mb-3">Stories of Hope and Healing</h2>
            <div className="mx-auto border-bottom" style={{ width: '50px', borderColor: '#4A90E2' }}></div>
          </Col>
        </Row>

        <Carousel 
          indicators={true}
          controls={false}
          interval={5000}
          pause={false}
          className="testimonial-carousel"
        >
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <Card className="mx-auto border-0 shadow-sm hover-card" 
                    style={{ maxWidth: '600px' }}>
                <Card.Body className="p-4 text-center">
                  <FaQuoteLeft className="mb-3" style={{ color: '#4A90E2', opacity: 0.2 }} size={20} />
                  
                  <div>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="rounded-circle mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        border: '2px solid #4A90E2',
                        padding: '2px'
                      }}
                    />
                    
                    <Card.Text className="fst-italic text-muted mb-3">
                      {testimonial.text}
                    </Card.Text>
                    
                    <div className="mb-2">
                      {[...Array(Math.floor(testimonial.stars))].map((_, i) => (
                        <FaStar key={i} className="text-warning mx-1" />
                      ))}
                    </div>
                    
                    <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                    <small style={{ color: '#4A90E2' }}>{testimonial.role}</small>
                  </div>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
}
