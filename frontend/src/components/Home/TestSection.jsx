
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Nav } from 'react-bootstrap';
import { Search, StarFill, Download, Heart, Eye, Filter } from 'react-bootstrap-icons';

export const TestSection = () => {
    const [activeCategory, setActiveCategory] = useState('all');
  
    const categories = [
      { id: 'all', name: 'All Templates' },
      { id: 'business', name: 'Business' },
      { id: 'portfolio', name: 'Portfolio' },
      { id: 'ecommerce', name: 'E-Commerce' },
      { id: 'blog', name: 'Blog' },
      { id: 'landing', name: 'Landing Pages' }
    ];
    
    const templates = [
      {
        id: 1,
        title: 'Artemis Pro',
        category: 'business',
        image: '/api/placeholder/400/240',
        rating: 4.8,
        reviews: 124,
        downloads: 3245,
        price: 49,
        tags: ['Responsive', 'Dark Mode'],
        author: 'DesignStudio'
      },
      {
        id: 2,
        title: 'Ecoshop',
        category: 'ecommerce',
        image: '/api/placeholder/400/240',
        rating: 4.9,
        reviews: 89,
        downloads: 1678,
        price: 59,
        tags: ['Eco-Friendly', 'Shopping Cart'],
        author: 'EcoThemes'
      },
      {
        id: 3,
        title: 'Portfolio Master',
        category: 'portfolio',
        image: '/api/placeholder/400/240',
        rating: 4.7,
        reviews: 56,
        downloads: 890,
        price: 39,
        tags: ['Creative', 'Gallery'],
        author: 'DesignPro'
      },
      {
        id: 4,
        title: 'BlogPress',
        category: 'blog',
        image: '/api/placeholder/400/240',
        rating: 4.5,
        reviews: 78,
        downloads: 1290,
        price: 29,
        tags: ['Minimalist', 'SEO Ready'],
        author: 'ContentCreators'
      },
      {
        id: 5,
        title: 'SalesLander',
        category: 'landing',
        image: '/api/placeholder/400/240',
        rating: 4.6,
        reviews: 45,
        downloads: 765,
        price: 35,
        tags: ['High Conversion', 'Lead Gen'],
        author: 'MarketingPros'
      },
      {
        id: 6,
        title: 'CorporateX',
        category: 'business',
        image: '/api/placeholder/400/240',
        rating: 4.4,
        reviews: 67,
        downloads: 1120,
        price: 45,
        tags: ['Corporate', 'Modern'],
        author: 'BizTemplates'
      }
    ];
    
    const filteredTemplates = activeCategory === 'all' 
      ? templates 
      : templates.filter(template => template.category === activeCategory);
    
    return (
      <section className="py-5 bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Premium Templates</h2>
            <div className="d-flex gap-2">
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search templates..." 
                  className="border-start-0" 
                />
              </InputGroup>
              <Button variant="outline-dark">
                <Filter className="me-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <Nav 
            className="mb-4 border-bottom pb-2" 
            variant="pills"
          >
            {categories.map(category => (
              <Nav.Item key={category.id}>
                <Nav.Link 
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="text-dark"
                >
                  {category.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          
          <Row className="g-4">
            {filteredTemplates.map(template => (
              <Col key={template.id} lg={4} md={6}>
                <Card className="h-100 border-0 shadow-sm template-card">
                  <div className="position-relative">
                    <Card.Img variant="top" src={template.image} />
                    <div className="template-overlay d-flex justify-content-center align-items-center">
                      <Button variant="light" className="me-2 rounded-circle p-2">
                        <Eye />
                      </Button>
                      <Button variant="primary" className="rounded-pill px-4">Preview</Button>
                      <Button variant="light" className="ms-2 rounded-circle p-2">
                        <Heart />
                      </Button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="light" text="dark" pill className="text-uppercase small">
                        {categories.find(c => c.id === template.category)?.name}
                      </Badge>
                      <div className="d-flex align-items-center text-warning">
                        <StarFill size={14} />
                        <span className="ms-1 small">{template.rating}</span>
                        <span className="ms-1 text-muted small">({template.reviews})</span>
                      </div>
                    </div>
                    <Card.Title className="h5 mb-2">{template.title}</Card.Title>
                    <div className="d-flex mb-3">
                      {template.tags.map((tag, index) => (
                        <span key={index} className="me-2 small text-muted">#{tag}</span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="small text-muted">
                        by <span className="fw-bold">{template.author}</span>
                      </div>
                      <div className="d-flex align-items-center small text-muted">
                        <Download size={14} className="me-1" />
                        {template.downloads}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">${template.price}</span>
                    <Button variant="outline-primary" size="sm">Add to Cart</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-5">
            <Button variant="primary" size="lg" className="px-5">
              View All Templates
            </Button>
          </div>
        </Container>
    </section>
  );
};

