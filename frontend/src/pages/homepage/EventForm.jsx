import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, updateEvent, fetchMyEvents } from '../../slices/eventSlice.js';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myEvents, loading, error } = useSelector((state) => state.events);
  const [form, setForm] = useState({ name: '', description: '', date: '', venue: '', category: '', bannerImage: '' });

  useEffect(() => {
    if (id) {
      const event = myEvents.find((item) => String(item.id) === id);
      if (event) {
        setForm({
          name: event.name || '',
          description: event.description || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
          venue: event.venue || '',
          category: event.category || '',
          bannerImage: event.bannerImage || '',
        });
      }
    }
  }, [id, myEvents]);

  useEffect(() => {
    if (id && !myEvents.length) {
      dispatch(fetchMyEvents());
    }
  }, [dispatch, id, myEvents.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date) {
      alert('Name and date are required');
      return;
    }

    try {
      if (id) {
        await dispatch(updateEvent({ id, payload: form })).unwrap();
      } else {
        await dispatch(createEvent(form)).unwrap();
      }
      navigate('/events');
    } catch (submitError) {
      console.error(submitError);
    }
  };

  return (
    <div className="p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 space-y-4 bg-white p-6 shadow">
        <div>
          <label className="block mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Venue</label>
          <input name="venue" value={form.venue} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Banner Image URL</label>
          <input name="bannerImage" value={form.bannerImage} onChange={handleChange} className="w-full border px-3 py-2" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-center">
            <button type="submit" className="bg-blue-600 text-white  px-4 py-2">{id ? 'Update Event' : 'Create Event'}</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
