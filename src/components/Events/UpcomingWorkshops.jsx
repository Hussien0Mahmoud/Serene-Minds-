import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function UpcomingWorkshops() {
  const workshops = [
    {
      title: "Stress Management",
      description: "Learn effective techniques for managing daily stress",
      date: "Every Tuesday",
      instructor: "Dr. Sarah Williams",
      category: "Self-Care"
    },
    {
      title: "Emotional Intelligence",
      description: "Develop better emotional awareness and regulation",
      date: "Every Thursday",
      instructor: "Dr. Michael Chen",
      category: "Personal Growth"
    },
    {
      title: "Relationship Skills",
      description: "Build healthier relationships through communication",
      date: "Every Saturday",
      instructor: "Dr. Emily Rodriguez",
      category: "Relationships"
    }
  ];

  return (
    <div style={{ background: '#f8f9fa' }} className="py-5">
      <Container>
        <h2 className="text-center mb-5">Featured Workshops</h2>
        <Row className="g-4">
          {workshops.map((workshop, index) => (
            <Col md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <span 
                      className="d-inline-block px-3 py-1 rounded-pill mb-3"
                      style={{ 
                        backgroundColor: 'rgba(102, 15, 241, 0.1)', 
                        color: '#660ff1' 
                      }}
                    >
                      {workshop.category}
                    </span>
                    <h4 className="mb-3">{workshop.title}</h4>
                    <p className="text-muted mb-3">{workshop.description}</p>
                    <div className="mt-auto">
                      <p className="mb-1"><strong>When:</strong> {workshop.date}</p>
                      <p className="mb-0"><strong>Led by:</strong> {workshop.instructor}</p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}