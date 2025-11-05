// frontend/src/components/SwapModal.jsx
import React, { useState } from 'react';

export default function SwapModal({ open, onClose, theirSlot = {}, mySwappables = [], onSubmit }) {
  const [selectedMySlot, setSelectedMySlot] = useState(mySwappables.length ? mySwappables[0].id : '');

  // Update selected when mySwappables change
  React.useEffect(() => {
    if (mySwappables.length) setSelectedMySlot(mySwappables[0].id);
    else setSelectedMySlot('');
  }, [mySwappables, open]);

  if (!open) return null;

  const handleSend = () => {
    if (!selectedMySlot) {
      alert('Please choose one of your swappable slots to offer.');
      return;
    }
    onSubmit(selectedMySlot);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{ width: 380, background: '#fff', padding: 20, borderRadius: 8 }}>
        <h3>Request swap with: <span style={{ fontWeight: 700 }}>{theirSlot.title}</span></h3>
        <div style={{ color: '#555', marginBottom: 12 }}>{new Date(theirSlot.startTime).toLocaleString()} — {new Date(theirSlot.endTime).toLocaleString()}</div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Choose your swappable slot</label>
          <select value={selectedMySlot} onChange={e => setSelectedMySlot(e.target.value)} style={{ width: '100%', padding: 8 }}>
            {mySwappables.length === 0 && <option value="">(No swappable slots)</option>}
            {mySwappables.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} — {new Date(s.startTime).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={handleSend} style={{ padding: '8px 12px' }}>Send Request</button>
          <button onClick={onClose} style={{ padding: '8px 12px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
