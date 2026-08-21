import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { api } from '../api';

export default function PickEventType() {
  const [eventTypes, setEventTypes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.eventTypes().then(setEventTypes).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="pick-head">
          <h1>What are you celebrating?</h1>
          <p>Pick an event type to start building your invitation.</p>
        </div>
        <div className="event-grid">
          {Object.entries(eventTypes).map(([key, ev]) => (
            <button className="event-card" key={key} onClick={() => navigate(`/create/${key}`)}>
              <span className="ic" style={{ background: ev.theme.accent + '22' }}>{ev.icon}</span>
              <div className="name">{ev.label}</div>
              <div className="desc">{ev.tagline}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .pick-head { text-align: center; padding: 50px 0 34px; }
        .pick-head h1 { font-size: 2rem; margin-bottom: 6px; }
        .pick-head p { opacity: 0.62; }
        .event-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding-bottom: 60px; }
        @media (max-width: 720px) { .event-grid { grid-template-columns: 1fr 1fr; } }
        .event-card {
          background: var(--site-card); border: 1px solid var(--site-line); border-radius: 5px;
          padding: 26px 18px; text-align: left; transition: transform .18s ease, box-shadow .18s ease;
        }
        .event-card:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(0,0,0,0.06); border-color: var(--site-accent); }
        .ic { font-size: 1.4rem; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .name { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
        .desc { font-size: 0.84rem; opacity: 0.6; }
      `}</style>
    </div>
  );
}
