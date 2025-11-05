import React, { useEffect, useState } from 'react';
import { getSwappable, getEvents, createSwapRequest } from '../services/api';

export default function Marketplace(){
  const [market, setMarket] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [selectedTheir, setSelectedTheir] = useState(null);
  const [selectedMy, setSelectedMy] = useState(null);

  const load = async () => {
    const res = await getSwappable();
    setMarket(res.data);
    const mine = await getEvents();
    setMySwappables(mine.data.filter(e => e.status === 'SWAPPABLE'));
  };

  useEffect(()=> { load(); }, []);

  const openOffer = (slot) => {
    setSelectedTheir(slot);
    setSelectedMy(null);
  };

  const submitRequest = async () => {
    if (!selectedMy) return alert('Choose one of your swappable slots to offer.');
    await createSwapRequest({ mySlotId: selectedMy._id, theirSlotId: selectedTheir._id });
    alert('Swap request sent');
    setSelectedTheir(null); setSelectedMy(null);
    load();
  };

  return (
    <div>
      <h2>Marketplace — Available Slots</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Available to swap</h3>
          <ul>
            {market.map(s => (
              <li key={s._id}>
                <b>{s.title}</b> — {new Date(s.startTime).toLocaleString()} to {new Date(s.endTime).toLocaleString()} (Owner: {s.owner?.name})
                <button onClick={()=>openOffer(s)}>Request Swap</button>
              </li>
            ))}
          </ul>
        </div>

        {selectedTheir && (
          <div style={{ width: 360 }}>
            <h3>Offer one of your SWAPPABLE slots</h3>
            <div><b>Requested slot:</b> {selectedTheir.title} — {new Date(selectedTheir.startTime).toLocaleString()}</div>
            <ul>
              {mySwappables.map(m => (
                <li key={m._id}>
                  <label>
                    <input type="radio" name="mychoice" onChange={()=>setSelectedMy(m)} />
                    {m.title} ({new Date(m.startTime).toLocaleString()})
                  </label>
                </li>
              ))}
            </ul>
            <div>
              <button onClick={submitRequest} disabled={!selectedMy}>Send Request</button>
              <button onClick={()=>{ setSelectedTheir(null); setSelectedMy(null); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
