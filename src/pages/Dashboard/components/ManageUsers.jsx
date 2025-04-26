import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, addNewUser, editUser, deleteUser } from '../../../api/userapi';

export default function ManageUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await deleteUser(id);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        setError('Failed to delete user');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedUser.id) {
        await editUser(selectedUser.id, selectedUser);
      } else {
        await addNewUser({
          ...selectedUser,
          dateJoined: new Date().toISOString(),
          profileImage: `https://ui-avatars.com/api/?name=${selectedUser.name.replace(/ /g, '+')}`,
          password: selectedUser.password || '123456'
        });
      }
      setShowModal(false);
      fetchUsers();
      alert(selectedUser.id ? 'User updated successfully!' : 'New user added successfully!');
    } catch (error) {
      setError('Failed to save user');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Manage Users</h4>
          <Button 
            onClick={() => {
              setSelectedUser({
                name: '',
                email: '',
                phone: '',
                role: 'user',
                password: ''
              });
              setShowModal(true);
            }}
            style={{ backgroundColor: '#660ff1', border: 'none' }}
          >
            Add New User
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
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}`}
                          alt={user.name}
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg={
                        user.role === 'admin' ? 'danger' : 
                        user.role === 'therapist' ? 'success' : 
                        'primary'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.dateJoined).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        onClick={() => handleEdit(user)}
                      >
                        <FaEdit className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDelete(user.id)}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedUser?.id ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  name: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={selectedUser?.phone || ''}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  phone: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={selectedUser?.role || 'user'}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  role: e.target.value
                })}
                required
              >
                <option value="user">User</option>
                <option value="therapist">Therapist</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            {!selectedUser?.id && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={selectedUser?.password || ''}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    password: e.target.value
                  })}
                  required
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#660ff1', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}