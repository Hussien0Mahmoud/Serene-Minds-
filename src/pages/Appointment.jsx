import React from 'react';
import AppointmentHero from '../components/Appointment/AppointmentHero';
import AppointmentForm from '../components/Appointment/AppointmentForm';
import TherapistList from '../components/Appointment/TherapistList';

export default function Appointment() {
  return (
    <>
      <AppointmentHero />
      <TherapistList />
      <AppointmentForm />
    </>
  );
}