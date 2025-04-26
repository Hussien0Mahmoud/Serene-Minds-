import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaRocket, FaCode, FaMobile, FaShieldAlt, FaCog, FaHeadset } from 'react-icons/fa';

export default function PremiumFeatures() {
  const features = [
    {
      icon: <FaRocket />,
      title: "High Performance",
      description: "Lightning-fast loading speeds optimized for all devices",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E8E)"
    },
    {
      icon: <FaCode />,
      title: "Clean Code",
      description: "Well-documented, maintainable code following best practices",
      gradient: "linear-gradient(135deg, #4E65FF, #92A1FF)"
    },
    {
      icon: <FaMobile />,
      title: "Responsive Design",
      description: "Seamlessly adapts to any screen size or device",
      gradient: "linear-gradient(135deg, #45B649, #87CF6B)"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description: "Built with security in mind, regular updates provided",
      gradient: "linear-gradient(135deg, #FF8008, #FFC837)"
    },
    {
      icon: <FaCog />,
      title: "Easy Customization",
      description: "Simple to modify and adapt to your specific needs",
      gradient: "linear-gradient(135deg, #8E2DE2, #B06AB3)"
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "Dedicated support team ready to help anytime",
      gradient: "linear-gradient(135deg, #660ff1, #ab84fd)"
    }
  ];

  return (
    <section className="premium-features py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col lg={8} className="mx-auto">
            <span className="text-uppercase fw-bold tracking-wider" 
                  style={{ 
                    color: '#660ff1',
                    fontSize: '0.9rem',
                    letterSpacing: '2px'
                  }}>
              Premium Features
            </span>
            <h2 className="display-5 fw-bold mt-3 mb-4">
              Everything You Need to Succeed
            </h2>
            <div className="feature-divider mx-auto mb-4"></div>
          </Col>
        </Row>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <div 
                className="feature-card p-4 h-100"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="icon-wrapper mb-4" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <h4 className="feature-title mb-3">{feature.title}</h4>
                <p className="feature-description mb-0">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}