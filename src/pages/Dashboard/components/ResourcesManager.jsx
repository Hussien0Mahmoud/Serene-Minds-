import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Nav } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBook, FaVideo } from 'react-icons/fa';
import axios from 'axios';

export default function ResourcesManager() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/resources?type=${activeTab === 'books' ? 'E-Book' : 'Video'}`);
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resourceData = {
        ...selectedResource,
        type: activeTab === 'books' ? 'E-Book' : 'Video',
        rating: selectedResource.rating || 0,
        reviews: selectedResource.reviews || 0
      };

      if (selectedResource.id) {
        await axios.put(`http://localhost:5000/resources/${selectedResource.id}`, resourceData);
      } else {
        await axios.post('http://localhost:5000/resources', {
          ...resourceData,
          id: Date.now().toString()
        });
      }
      setShowModal(false);
      fetchResources();
      alert(selectedResource.id ? 'Resource updated successfully!' : 'New resource added successfully!');
    } catch (error) {
      setError('Failed to save resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://localhost:5000/resources/${id}`);
        fetchResources();
      } catch (err) {
        setError('Failed to delete resource');
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setSelectedResource({
        ...selectedResource,
        tags: [...(selectedResource.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...(selectedResource.tags || [])];
    updatedTags.splice(index, 1);
    setSelectedResource({
      ...selectedResource,
      tags: updatedTags
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'books'} 
                onClick={() => setActiveTab('books')}
              >
                <FaBook className="me-2" />
                Books
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'videos'} 
                onClick={() => setActiveTab('videos')}
              >
                <FaVideo className="me-2" />
                Videos
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-end">
          <Button 
            onClick={() => {
              setSelectedResource({
                title: '',
                author: '',
                description: '',
                category: '',
                tags: [],
                url: '',
                featured: false,
                thumbnailUrl: ''
              });
              setShowModal(true);
            }}
            style={{ backgroundColor: '#660ff1', border: 'none' }}
          >
            <FaPlus className="me-2" />
            Add New {activeTab === 'books' ? 'Book' : 'Video'}
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>{activeTab === 'books' ? 'Author' : 'Creator'}</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={resource.thumbnailUrl}
                          alt={resource.title}
                          className="me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{resource.title}</div>
                          <small className="text-muted">{resource.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>{resource.author}</td>
                    <td>
                      <Badge bg="info">{resource.category}</Badge>
                    </td>
                    <td>{resource.rating} ({resource.reviews} reviews)</td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        onClick={() => {
                          setSelectedResource(resource);
                          setShowModal(true);
                        }}
                      >
                        <FaEdit className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDelete(resource.id)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedResource?.id ? 'Edit' : 'Add New'} {activeTab === 'books' ? 'Book' : 'Video'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedResource?.title || ''}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      title: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{activeTab === 'books' ? 'Author' : 'Creator'}</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedResource?.author || ''}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      author: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedResource?.description || ''}
                onChange={(e) => setSelectedResource({
                  ...selectedResource,
                  description: e.target.value
                })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={selectedResource?.category || ''}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      category: e.target.value
                    })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Anxiety & Depression">Anxiety & Depression</option>
                    <option value="Stress Management">Stress Management</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Mindfulness">Mindfulness</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (Videos Only)</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedResource?.duration || ''}
                    onChange={(e) => setSelectedResource({
                      ...selectedResource,
                      duration: e.target.value
                    })}
                    placeholder="e.g., 10:30"
                    disabled={activeTab === 'books'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{activeTab === 'books' ? 'Book URL' : 'Video URL'}</Form.Label>
              <Form.Control
                type="url"
                value={selectedResource?.url || ''}
                onChange={(e) => setSelectedResource({
                  ...selectedResource,
                  url: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control
                type="url"
                value={selectedResource?.thumbnailUrl || ''}
                onChange={(e) => setSelectedResource({
                  ...selectedResource,
                  thumbnailUrl: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="mb-2">
                {selectedResource?.tags?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    className="me-2 mb-2 p-2"
                    bg="secondary"
                  >
                    {tag}
                    <FaTimes 
                      className="ms-2 cursor-pointer" 
                      onClick={() => handleRemoveTag(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                />
                <Button 
                  onClick={handleAddTag}
                  variant="outline-primary"
                >
                  <FaPlus />
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Featured Resource"
                checked={selectedResource?.featured || false}
                onChange={(e) => setSelectedResource({
                  ...selectedResource,
                  featured: e.target.checked
                })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#660ff1', border: 'none' }}
              >
                {selectedResource?.id ? 'Update' : 'Add'} Resource
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}