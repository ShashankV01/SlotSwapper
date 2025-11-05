import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';

export default function Dashboard(){
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getEvents();
    setEvents(res.data);
    setLoading(false);
  };

  useEffect(()=> { load(); }, []);

  const createNew = async (e) => {
    e.preventDefault();
    await createEvent({ title, startTime: start, endTime: end });
    setTitle(''); setStart(''); setEnd('');
    load();
  };

  const toggleSwappable = async (ev) => {
    const newStatus = ev.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
    await updateEvent(ev._id, { status: newStatus });
    load();
  };

  const remove = async (ev) => {
    if (!window.confirm('Delete event?')) return;
    await deleteEvent(ev._id);
    load();
  };

  return (
    <div>
      <h2>Your Events</h2>
      <form onSubmit={createNew} style={{ marginBottom: 20 }}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} required />
        <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} required />
        <button type="submit">Add</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <table border="1" cellPadding="6">
          <thead><tr><th>Title</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev._id}>
                <td>{ev.title}</td>
                <td>{new Date(ev.startTime).toLocaleString()}</td>
                <td>{new Date(ev.endTime).toLocaleString()}</td>
                <td>{ev.status}</td>
                <td>
                  <button onClick={()=>toggleSwappable(ev)}>{ev.status==='BUSY' ? 'Make Swappable' : 'Make Busy'}</button>
                  <button onClick={()=>remove(ev)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
