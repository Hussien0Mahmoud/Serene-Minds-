import React from 'react';
import EventsHero from '../components/Events/EventsHero';
import EventsList from '../components/Events/EventsList';
import EventsCalendar from '../components/Events/EventsCalendar';
import UpcomingWorkshops from '../components/Events/UpcomingWorkshops';

export default function Events() {
  return (
    <>
      <EventsHero />
      {/* <EventsCalendar /> */}
      <EventsList />
      <UpcomingWorkshops />
    </>
  );
}