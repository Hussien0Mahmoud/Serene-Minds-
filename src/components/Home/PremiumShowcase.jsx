import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaRocket, 
  FaCode, 
  FaMobileAlt, 
  FaShieldAlt, 
  FaPalette, 
  FaHeadset 
} from 'react-icons/fa';

export default function PremiumShowcase() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('premium-showcase');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      description: "Optimized for maximum performance",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
      color: "#FF6B6B"
    },
    {
      icon: <FaCode />,
      title: "Clean Code",
      description: "Well-documented & maintainable",
      gradient: "linear-gradient(135deg, #4E65FF 0%, #92A1FF 100%)",
      color: "#4E65FF"
    },
    {
      icon: <FaMobileAlt />,
      title: "Fully Responsive",
      description: "Perfect on every device",
      gradient: "linear-gradient(135deg, #45B649 0%, #87CF6B 100%)",
      color: "#45B649"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description: "Built with security in mind",
      gradient: "linear-gradient(135deg, #FF8008 0%, #FFC837 100%)",
      color: "#FF8008"
    },
    {
      icon: <FaPalette />,
      title: "Modern Design",
      description: "Latest design trends",
      gradient: "linear-gradient(135deg, #8E2DE2 0%, #B06AB3 100%)",
      color: "#8E2DE2"
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "We're here to help",
      gradient: "linear-gradient(135deg, #660ff1 0%, #ab84fd 100%)",
      color: "#660ff1"
    }
  ];

  return (
    <section id="premium-showcase" className="premium-showcase py-5">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <div 
              className="section-header"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : '30px'})`,
                transition: 'all 0.6s ease-out'
              }}
            >
              <span className="badge text-uppercase p-3 rounded-pill mb-3">
                Premium Features
              </span>
              <h2 className="display-5 fw-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <div className="feature-divider mx-auto"></div>
            </div>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <div 
                className="feature-card"
                onMouseEnter={() => setActiveFeature(index)}
                style={{ 
                  opacity: isVisible ? 1 : 0,
                  transform: `translateY(${isVisible ? 0 : '30px'})`,
                  transition: `all 0.6s ease-out ${index * 0.1}s`
                }}
              >
                <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>
                  {React.cloneElement(feature.icon, { size: 24 })}
                  <div className="feature-icon-glow" style={{ background: feature.gradient }}></div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}