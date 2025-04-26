import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

export default function AppointmentConfirmation({ show, onClose, appointment }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="text-center p-5">
        <FaCheckCircle className="text-success mb-4" size={60} />
        <h4 className="mb-4">Appointment Confirmed!</h4>
        <p>Your appointment has been successfully booked with {appointment?.doctorName}</p>
        <p className="mb-4">
          <strong>Date:</strong> {appointment?.date} at {appointment?.time}
        </p>
        <Button 
          onClick={onClose}
          className="w-100"
          style={{ backgroundColor: '#660ff1', border: 'none' }}
        >
          Done
        </Button>
      </Modal.Body>
    </Modal>
  );
}