import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaBell, FaLock, FaGlobe, FaPalette } from 'react-icons/fa';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true
    },
    language: 'en',
    theme: 'light'
  });

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handlePrivacyChange = (key, value) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    });
  };

  const handleChange = (section, value) => {
    setSettings({
      ...settings,
      [section]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <Container fluid className="py-4">
      <h4 className="mb-4">Settings</h4>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaBell className="me-2" style={{ color: '#660ff1' }} />
                  <h5 className="mb-0">Notifications</h5>
                </div>

                <Form.Check 
                  type="switch"
                  id="email-notifications"
                  label="Email Notifications"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="mb-3"
                />
                <Form.Check 
                  type="switch"
                  id="push-notifications"
                  label="Push Notifications"
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="mb-3"
                />
                <Form.Check 
                  type="switch"
                  id="sms-notifications"
                  label="SMS Notifications"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaLock className="me-2" style={{ color: '#660ff1' }} />
                  <h5 className="mb-0">Privacy</h5>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Profile Visibility</Form.Label>
                  <Form.Select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                  </Form.Select>
                </Form.Group>

                <Form.Check 
                  type="switch"
                  id="online-status"
                  label="Show Online Status"
                  checked={settings.privacy.showOnlineStatus}
                  onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaGlobe className="me-2" style={{ color: '#660ff1' }} />
                  <h5 className="mb-0">Language</h5>
                </div>

                <Form.Select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <FaPalette className="me-2" style={{ color: '#660ff1' }} />
                  <h5 className="mb-0">Theme</h5>
                </div>

                <Form.Select
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button 
            type="submit"
            style={{ backgroundColor: '#660ff1', border: 'none' }}
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
}