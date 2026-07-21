import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../slices/dashboardSlice.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totalEvents, upcomingEvents, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow p-5">
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-4xl mt-4">{totalEvents}</p>
        </div>
        <div className="bg-white shadow p-5">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-4xl mt-4">{upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
