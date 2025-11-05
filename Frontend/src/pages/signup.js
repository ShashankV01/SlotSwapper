import React, { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setUser }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({ name, email, password });
      localStorage.setItem('ss_token', res.data.token);
      localStorage.setItem('ss_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      nav('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div>
          <label>Name</label><br/>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
