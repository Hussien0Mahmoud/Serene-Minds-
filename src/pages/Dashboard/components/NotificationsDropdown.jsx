import React, { useEffect } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { FaBell, FaCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setNotifications, markAsRead } from '../../../store/slices/notificationSlice';

export default function NotificationsDropdown() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/notifications`);
      const userNotifications = response.data.filter(note => 
        note.userId === currentUser.id || 
        note.role === 'all' || 
        note.role === currentUser.role
      );
      dispatch(setNotifications(userNotifications));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/notifications/${id}`, { read: true });
      dispatch(markAsRead(id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" className="text-dark position-relative">
        <FaBell size={20} />
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        <Dropdown.Header className="d-flex justify-content-between align-items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge bg="primary">{unreadCount} new</Badge>
          )}
        </Dropdown.Header>
        
        {notifications.length === 0 ? (
          <Dropdown.Item disabled>No notifications</Dropdown.Item>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item 
              key={notification.id}
              onClick={() => handleRead(notification.id)}
              className="border-bottom"
            >
              <div className="d-flex align-items-start gap-2">
                {!notification.read && (
                  <FaCircle className="text-primary mt-1" size={8} />
                )}
                <div>
                  <div className="fw-bold">{notification.title}</div>
                  <div className="text-muted small">{notification.message}</div>
                  <div className="text-muted smaller mt-1">
                    {new Date(notification.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}