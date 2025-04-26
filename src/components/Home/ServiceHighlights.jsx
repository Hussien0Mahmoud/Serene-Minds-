import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaArrowRight } from 'react-icons/fa';

export default function ServiceHighlights() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const services = [
    {
      title: "Individual Therapy",
      description: "One-on-one sessions with licensed therapists tailored to your needs",
      image: "https://media.istockphoto.com/id/860065560/photo/patient-after-traumatic-events.jpg?s=612x612&w=0&k=20&c=CTTF2-vA6YNdwt00Tt77RZPySGvZ2o_6Nqq0Pb5lM0g=",
      color: "#4A90E2"
    },
    {
      title: "Group Support",
      description: "Connect with others facing similar challenges in a guided environment",
      image: "https://media.istockphoto.com/id/1404822602/photo/group-of-people-sitting-in-a-circle-talking-to-each-other-having-a-group-therapy-appointment.jpg?s=612x612&w=0&k=20&c=Y66GI3JJzo4jZbBk8PpGPsMFdTVOHL12VLiPanzZuEQ=",
      color: "#50E3C2"
    },
    {
      title: "Crisis Intervention",
      description: "24/7 emergency support when you need it most",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZAN9tnO0ilNHLOyUG8munpwDefy8Lnq9Sw&s",
      color: "#F5A623"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="service-highlights py-5" style={{ background: '#f8f9fa' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="display-4 fw-bold mb-4">Our Services</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Discover our range of professional mental health services designed to support your well-being
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Row className="g-4">
            {services.map((service, index) => (
              <Col lg={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="position-relative"
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="service-card rounded-4 overflow-hidden"
                    style={{
                      position: 'relative',
                      height: '400px',
                      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.3s ease-in-out',
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <motion.div
                      className="content p-4"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(255,255,255,0.95)',
                        borderTop: `4px solid ${service.color}`
                      }}
                      initial={{ y: 100 }}
                      animate={{ y: hoveredIndex === index ? 0 : 60 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="h4 fw-bold mb-2">{service.title}</h3>
                      <p className="mb-3" style={{ fontSize: '0.9rem' }}>{service.description}</p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button 
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ color: service.color }}
                        >
                          Learn More <FaArrowRight className="ms-2" />
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      <style jsx>{`
        .service-highlights {
          position: relative;
          overflow: hidden;
        }

        .service-card {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .service-card {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}