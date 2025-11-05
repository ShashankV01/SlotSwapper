import React, { useEffect, useState } from 'react';
import { getSwapRequests, respondSwap } from '../services/api';

export default function Requests(){
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const load = async () => {
    const res = await getSwapRequests();
    setIncoming(res.data.incoming);
    setOutgoing(res.data.outgoing);
  };

  useEffect(()=> { load(); }, []);

  const respond = async (id, accept) => {
    if (!window.confirm(accept ? 'Accept this swap?' : 'Reject this swap?')) return;
    await respondSwap(id, { accept });
    load();
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <h3>Incoming Requests</h3>
        {incoming.map(r => (
          <div key={r._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <div><b>From:</b> {r.requester.name}</div>
            <div><b>Their slot:</b> {r.mySlot.title} ({new Date(r.mySlot.startTime).toLocaleString()})</div>
            <div><b>Your slot:</b> {r.theirSlot.title} ({new Date(r.theirSlot.startTime).toLocaleString()})</div>
            <div><b>Status:</b> {r.status}</div>
            <button onClick={()=>respond(r._id, true)}>Accept</button>
            <button onClick={()=>respond(r._id, false)}>Reject</button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <h3>Outgoing Requests</h3>
        {outgoing.map(r => (
          <div key={r._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <div><b>To:</b> {r.responder.name}</div>
            <div><b>Your slot:</b> {r.mySlot.title} ({new Date(r.mySlot.startTime).toLocaleString()})</div>
            <div><b>Their slot:</b> {r.theirSlot.title} ({new Date(r.theirSlot.startTime).toLocaleString()})</div>
            <div><b>Status:</b> {r.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
