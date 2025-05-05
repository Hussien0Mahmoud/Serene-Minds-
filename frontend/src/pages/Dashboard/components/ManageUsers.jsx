import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, addNewUser, editUser, deleteUser } from '../../../api/userapi';

const colors = {
  primary: '#660ff1',
  primaryLight: 'rgba(102, 15, 241, 0.1)',
  primaryMedium: 'rgba(102, 15, 241, 0.3)',
  primaryDark: 'rgba(102, 15, 241, 0.8)',
  text: '#2a0966',
  danger: '#dc3545',
  success: '#198754'
};

export default function ManageUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: true
  });
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (loadMore = false) => {
    try {
      setLoading(true);
      const response = await getAllUsers(loadMore ? pagination.page + 1 : 1);
      const usersData = response.data.results || [];
      
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.name === 'Anon' ? user.username : user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        profileImage: user.profile_image,
        dateJoined: user.date_joined
      }));
      
      if (loadMore) {
        setUsers(prev => [...prev, ...transformedUsers]);
        setPagination(prev => ({
          page: prev.page + 1,
          hasMore: response.data.next !== null
        }));
      } else {
        setUsers(transformedUsers);
        setPagination({
          page: 1,
          hasMore: response.data.next !== null
        });
      }
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
      const userData = {
        username: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
      };

      if (selectedUser.id) {

        if (passwordFields.currentPassword || passwordFields.newPassword) {
          if (!passwordFields.currentPassword) {
            alert('Current password is required to change password');
            return;
          }
          if (!passwordFields.newPassword) {
            alert('New password is required');
            return;
          }
          userData.current_password = passwordFields.currentPassword;
          userData.new_password = passwordFields.newPassword;
        }
        await editUser(selectedUser.id, userData);
      } else {

        userData.password = selectedUser.password;
        await addNewUser(userData);
      }
      
      setShowModal(false);
      setPasswordFields({ currentPassword: '', newPassword: '' });
      await fetchUsers();
      alert(selectedUser.id ? 'User updated successfully!' : 'New user added successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to save user');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const PaginationControls = () => {
    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    
    return (
      <div className="d-flex justify-content-end mt-4 gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          disabled={pagination.currentPage === 1}
          onClick={() => fetchUsers(pagination.currentPage - 1)}
        >
          Previous
        </Button>
        
        {pages.map(page => (
          <Button
            key={page}
            variant={page === pagination.currentPage ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => fetchUsers(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline-primary"
          size="sm"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => fetchUsers(pagination.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  const LoadMoreButton = () => {
    if (!pagination.hasMore) return null;
    
    return (
      <div className="text-center mt-4">
        <Button
          variant="outline-primary"
          onClick={() => fetchUsers(true)}
          disabled={loading}
          style={{ 
            borderColor: colors.primary,
            color: colors.primary
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = colors.primaryLight;
            e.target.style.borderColor = colors.primary;
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = colors.primary;
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Loading...
            </>
          ) : (
            'Load More'
          )}
        </Button>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0" style={{ color: colors.text }}>Manage Users</h4>
          <Button 
            onClick={() => {
              setSelectedUser({
                name: '',
                email: '',
                phone: '',
                role: 'user',
                password: ''
              });
              setPasswordFields({ currentPassword: '', newPassword: '' });
              setShowModal(true);
            }}
            style={{ 
              backgroundColor: colors.primary, 
              border: 'none',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryDark}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
          >
            Add New User
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: colors.primary }} role="status">
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
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
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
                      <Badge style={{ 
                        backgroundColor: user.role === 'admin' ? colors.danger : 
                                      user.role === 'therapist' ? colors.success : 
                                      colors.primary
                      }}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{new Date(user.dateJoined).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        onClick={() => handleEdit(user)}
                      >
                        <FaEdit style={{ color: colors.primary }} />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash style={{ color: colors.danger }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <LoadMoreButton />
          </Card.Body>
        </Card>
      )}

      <Modal 
        show={showModal}
        onHide={() => setShowModal(false)}
        style={{ color: colors.text }}
      >
        <Modal.Header 
          closeButton 
          style={{ borderBottom: `1px solid ${colors.primaryLight}` }}
        >
          <Modal.Title style={{ color: colors.text }}>
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

            {selectedUser?.id ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordFields.currentPassword}
                    onChange={(e) => setPasswordFields({
                      ...passwordFields,
                      currentPassword: e.target.value
                    })}
                    placeholder="Enter current password"
                  />
                  <Form.Text className="text-muted">
                    Required only if changing password
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordFields.newPassword}
                    onChange={(e) => setPasswordFields({
                      ...passwordFields,
                      newPassword: e.target.value
                    })}
                    placeholder="Enter new password"
                  />
                  <Form.Text className="text-muted">
                    Leave blank to keep current password
                  </Form.Text>
                </Form.Group>
              </>
            ) : (
              
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
                  placeholder="Enter password"
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                style={{ 
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  border: 'none'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                style={{ 
                  backgroundColor: colors.primary,
                  border: 'none',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.primaryDark}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
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