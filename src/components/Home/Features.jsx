import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaBrain, FaHandHoldingHeart, FaUserShield, FaVideo, FaComments, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: FaBrain,
      title: "Expert Counseling",
      description: "Professional therapists specializing in various mental health areas",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)"
    },
    {
      icon: FaHandHoldingHeart,
      title: "Compassionate Care",
      description: "Empathetic support in a judgment-free environment",
      gradient: "linear-gradient(135deg, #4E65FF, #92A1FF)"
    },
    {
      icon: FaUserShield,
      title: "Complete Privacy",
      description: "Secure and confidential sessions with encrypted communication",
      gradient: "linear-gradient(135deg, #45B649, #87CF6B)"
    },
    {
      icon: FaVideo,
      title: "Virtual Sessions",
      description: "Convenient online therapy from the comfort of your home",
      gradient: "linear-gradient(135deg, #FF8008, #FFC837)"
    },
    {
      icon: FaComments,
      title: "24/7 Support",
      description: "Round-the-clock access to crisis support and resources",
      gradient: "linear-gradient(135deg, #8E2DE2, #B06AB3)"
    },
    {
      icon: FaUserFriends,
      title: "Group Support",
      description: "Connect with others in moderated support groups",
      gradient: "linear-gradient(135deg, #2193b0, #6dd5ed)"
    }
  ];

  return (
    <section className="features-section py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="display-5 fw-bold mb-4">Comprehensive Mental Health Support</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Experience professional care with our range of mental health services designed to support your well-being journey
          </p>
        </motion.div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={4} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="h-100 border-0 shadow-sm"
                  style={{ 
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <Card.Body className="p-4">
                    <div 
                      className="feature-icon-wrapper mb-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: feature.gradient
                      }}
                    >
                      <feature.icon size={24} color="white" />
                    </div>
                    <h3 className="h5 fw-bold mb-3">{feature.title}</h3>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <style jsx>{`
        .features-section {
          position: relative;
          overflow: hidden;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }

        .feature-icon-wrapper {
          transition: transform 0.3s ease;
        }

        .card:hover .feature-icon-wrapper {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}