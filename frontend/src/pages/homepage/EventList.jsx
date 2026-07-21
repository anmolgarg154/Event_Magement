import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, deleteEvent } from '../../slices/eventSlice.js';
import { Link } from 'react-router-dom';

const EventList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) {
      dispatch(deleteEvent(id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Event List</h2>
        <Link to="/events/new" className="bg-green-600 text-white px-4 py-2">Add Event</Link>
      </div>
      {loading && <div>Loading events...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid gap-4">
        {list.map((event) => (
          <div key={event.id} className="bg-white shadow p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-sm text-slate-500">{new Date(event.date).toLocaleString()}</p>
                <p className="mt-2">{event.description}</p>
                <p className="mt-2 text-sm">Venue: {event.venue}</p>
                <p className="mt-2 text-sm">Category: {event.category}</p>
              </div>
              <div className="space-x-2 text-right">
                <Link to={`/events/${event.id}/edit`} className="text-blue-600 border border-blue-700 p-2">Edit</Link>
                <button onClick={() => handleDelete(event.id)} className="text-red-600 border border-red-700 p-2">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
