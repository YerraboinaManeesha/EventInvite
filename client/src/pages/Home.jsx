import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Reveal from '../components/Reveal';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [eventTypes, setEventTypes] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.eventTypes().then(setEventTypes).catch(() => setEventTypes({}));
  }, []);

  function pickEvent(key) {
    navigate(user ? `/create/${key}` : `/signup?next=/create/${key}`);
  }

  return (
    <div>
      <Navbar />

      <header className="hero">
        <div className="eyebrow">Invitation websites, made simple</div>
        <h1>Every celebration<br />deserves its own site</h1>
        <p className="sub">Pick your event, add your details, and share a beautiful invitation website with your own guests.</p>
        <a href="#events" className="btn btn-primary">Choose Your Event</a>
      </header>

      <div className="container">
        <section id="events">
          <Reveal as="div" className="section-head">
            <h2>What are you celebrating?</h2>
            <p>Pick your event type to get started — free to create.</p>
          </Reveal>

          <div className="event-grid">
            {eventTypes && Object.entries(eventTypes).map(([key, ev], i) => (
              <Reveal key={key} delay={i * 60}>
                <button className="event-card" onClick={() => pickEvent(key)}>
                  <span className="ic" style={{ background: ev.theme.accent + '22' }}>{ev.icon}</span>
                  <div className="name">{ev.label}</div>
                  <div className="desc">{ev.tagline}</div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="how">
          <Reveal as="div" className="section-head">
            <h2>How It Works</h2>
            <p>Three simple steps from idea to invitation.</p>
          </Reveal>
          <div className="steps">
            {[
              ['1', 'Pick your event type', 'Choose from wedding, birthday, corporate and more.'],
              ['2', 'Add your details', 'Names, date, venue, schedule and photos — one short form.'],
              ['3', 'Get your site & share it', 'Receive your own link, ready to send to your guests.']
            ].map(([num, title, desc], i) => (
              <Reveal as="div" className="step" key={num} delay={i * 100}>
                <div className="num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <footer>
        <div className="navbar-logo">Event<span style={{ color: 'var(--site-accent)' }}>Invite</span></div>
        <div className="f-tag">Beautiful invitation websites for every celebration.</div>
      </footer>

      <style>{`
        .hero { text-align: center; padding: 70px 24px 56px; }
        .hero .eyebrow { font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--site-accent); margin-bottom: 16px; }
        .hero h1 { font-size: clamp(2.3rem, 6.5vw, 4rem); margin-bottom: 18px; }
        .hero .sub { max-width: 460px; margin: 0 auto 30px; opacity: 0.7; font-size: 1.05rem; }

        section { padding: 56px 0; }
        .section-head { text-align: center; margin-bottom: 40px; }
        .section-head h2 { font-size: 2rem; margin-bottom: 6px; }
        .section-head p { opacity: 0.62; font-size: 0.95rem; }

        .event-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 720px) { .event-grid { grid-template-columns: 1fr 1fr; } }
        .event-card {
          background: var(--site-card); border: 1px solid var(--site-line); border-radius: 5px;
          padding: 26px 18px; text-align: left; transition: transform .18s ease, box-shadow .18s ease;
          width: 100%;
        }
        .event-card:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(0,0,0,0.06); border-color: var(--site-accent); }
        .ic { font-size: 1.4rem; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .name { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
        .desc { font-size: 0.84rem; opacity: 0.6; }

        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        @media (max-width: 720px) { .steps { grid-template-columns: 1fr; } }
        .step { text-align: center; }
        .step .num {
          width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--site-accent); color: var(--site-accent);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-family: 'Fraunces', serif;
        }
        .step h3 { font-size: 1.08rem; margin-bottom: 5px; }
        .step p { font-size: 0.88rem; opacity: 0.62; }

        footer { border-top: 1px solid var(--site-line); padding: 40px 28px; text-align: center; margin-top: 20px; }
        .f-tag { font-size: 0.85rem; opacity: 0.55; margin-top: 6px; }
      `}</style>
    </div>
  );
}
