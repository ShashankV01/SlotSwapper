// frontend/src/components/EventList.jsx
import React from 'react';

export default function EventList({ events = [], onToggleSwappable, onDelete }) {
  return (
    <div>
      {events.map(ev => (
        <div key={ev.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12, borderRadius: 6 }}>
          <div style={{ fontWeight: 700 }}>{ev.title}</div>
          <div style={{ color: '#555' }}>
            {new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fafafa' }}>
              {ev.status}
            </span>
            {' '}
            {ev.status === 'BUSY' && (
              <button style={{ marginLeft: 8 }} onClick={() => onToggleSwappable(ev.id, 'SWAPPABLE')}>Make Swappable</button>
            )}
            {ev.status === 'SWAPPABLE' && (
              <button style={{ marginLeft: 8 }} onClick={() => onToggleSwappable(ev.id, 'BUSY')}>Unmake</button>
            )}
            <button style={{ marginLeft: 8 }} onClick={() => onDelete && onDelete(ev.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
