import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { api } from '../api';

export default function PublicInvitation() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    Promise.all([api.getPublicInvitation(slug), api.eventTypes()])
      .then(([inv, all]) => {
        setInvite(inv);
        setConfig(all[inv.eventType]);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="not-found">
        <h1>Invitation not found</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!invite || !config) return null;

  const t = config.theme;

  return (
    <div
      className="invite-page"
      style={{
        '--accent': t.accent,
        '--accent2': t.accent2,
        '--bg': t.bg,
        '--card': t.card,
        '--ink': t.ink,
        '--line': t.line,
        '--display': t.display,
        '--body': t.body
      }}
    >
      <button
        className="back-btn"
        onClick={() => navigate(`/edit/${invite._id}`)}
      >
        ← Back to Edit
      </button>

      <section className="hero">
        <Reveal className="eyebrow">{invite.eyebrow}</Reveal>

        <Reveal as="h1" delay={100}>
          {invite.title}
        </Reveal>

        <Reveal className="rule" delay={180} />

        <Reveal className="meta" delay={220}>
          {invite.eventDate} · {invite.location}
        </Reveal>
      </section>

      <div className="wrap">

        {invite.storyText && (
          <section>
            <div className="divider-row">
              <Reveal as="h2" className="section-title">
                {invite.storyTitle}
              </Reveal>
              <div className="rule flex" />
            </div>

            <Reveal as="p" className="story-text">
              {invite.storyText}
            </Reveal>
          </section>
        )}

        {invite.timeline?.length > 0 && (
          <section>
            <div className="divider-row">
              <Reveal as="h2" className="section-title">
                {invite.scheduleTitle}
              </Reveal>
              <div className="rule flex" />
            </div>

            <div className="timeline">
              {invite.timeline.map((item, i) => (
                <Reveal
                  as="div"
                  className="tl-item"
                  key={i}
                  delay={i * 90}
                >
                  <div className="tl-time">
                    {item.time}
                  </div>

                  <div className="tl-name">
                    {item.title}
                  </div>

                  {item.description && (
                    <div className="tl-desc">
                      {item.description}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {invite.photos?.length > 0 && (
          <section>
            <div className="divider-row">
              <Reveal as="h2" className="section-title">
                Photos
              </Reveal>
              <div className="rule flex" />
            </div>

            <div className="gallery">
              {invite.photos.map((src, i) => (
                <Reveal
                  as="button"
                  className="g-item"
                  key={i}
                  delay={i * 60}
                  onClick={() => setLightbox(src)}
                >
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {invite.venues?.length > 0 && (
          <section>
            <div className="divider-row">
              <Reveal as="h2" className="section-title">
                {invite.infoTitle}
              </Reveal>
              <div className="rule flex" />
            </div>

            <div className="info-cards">
              {invite.venues.map((v, i) => (
                <Reveal
                  as="div"
                  className="i-card"
                  key={i}
                  delay={i * 90}
                >
                  {v.label && (
                    <span className="eyebrow-small">
                      {v.label}
                    </span>
                  )}

                  <h3>{v.name}</h3>

                  {v.address && (
                    <p>{v.address}</p>
                  )}

                  {v.note && (
                    <p className="note">
                      {v.note}
                    </p>
                  )}

                  {v.mapUrl && (
                    <a
                      href={v.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="map-link"
                    >
                      View on map →
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section id="rsvp">
          <div className="divider-row">
            <Reveal as="h2" className="section-title">
              RSVP
            </Reveal>
            <div className="rule flex" />
          </div>

          <RsvpForm
            slug={slug}
            rsvpNote={invite.rsvpNote}
            fields={invite.rsvpFields}
          />
        </section>
      </div>

      <footer>
        <div className="f-name">
          {invite.title}
        </div>

        <div className="f-meta">
          {invite.eventDate}
        </div>

        <div className="f-brand">
          Made with EventInvite
        </div>
      </footer>

      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Enlarged"
          />
        </div>
      )}

      <style>{`
        .invite-page {
          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.65;
          min-height: 100vh;
        }

        .invite-page h1,
        .invite-page h2,
        .invite-page h3 {
          font-family: var(--display);
          font-weight: 600;
        }

        .wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 26px;
        }

        .back-btn {
          position: fixed;
          top: 18px;
          left: 18px;
          z-index: 50;
          padding: 8px 16px;
          border: 1px solid var(--line);
          border-radius: 4px;
          background: var(--card);
          color: var(--ink);
          font-family: var(--body);
          font-size: 0.85rem;
          cursor: pointer;
        }

        .back-btn:hover {
          opacity: 0.75;
        }

        .hero {
          min-height: 56vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px 56px;
        }

        .eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }

        .hero h1 {
          font-size: clamp(2.4rem, 7vw, 4.2rem);
          line-height: 1.08;
        }

        .hero .meta {
          margin-top: 18px;
          font-size: 1.05rem;
          opacity: 0.75;
        }

        .rule {
          width: 56px;
          height: 1px;
          background: var(--accent);
          margin: 20px auto;
        }

        .rule.flex {
          flex: 1;
          margin: 0;
          width: auto;
        }

        section {
          padding: 54px 0;
        }

        .divider-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 1.85rem;
          white-space: nowrap;
        }

        .story-text {
          max-width: 620px;
          opacity: 0.78;
          font-size: 1.05rem;
        }

        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 5px;
          bottom: 5px;
          width: 1px;
          background: var(--accent);
          opacity: 0.4;
        }

        .tl-item {
          position: relative;
          padding-bottom: 32px;
        }

        .tl-item::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent2);
        }

        .tl-time {
          font-family: var(--display);
          font-style: italic;
          color: var(--accent2);
          font-size: 1rem;
        }

        .tl-name {
          font-size: 1.22rem;
          margin: 2px 0 3px;
        }

        .tl-desc {
          opacity: 0.65;
          font-size: 0.92rem;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        @media (max-width: 640px) {
          .gallery {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .g-item {
          aspect-ratio: 1/1;
          border-radius: 3px;
          overflow: hidden;
          border: none;
          padding: 0;
          cursor: pointer;
          background: var(--card);
        }

        .g-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .g-item:hover img {
          transform: scale(1.06);
        }

        .info-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .info-cards {
            grid-template-columns: 1fr;
          }
        }

        .i-card {
          border: 1px solid var(--line);
          background: var(--card);
          padding: 22px 20px;
          border-radius: 4px;
        }

        .eyebrow-small {
          font-size: 0.7rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--accent);
          display: block;
          margin-bottom: 6px;
        }

        .i-card h3 {
          font-size: 1.25rem;
          margin-bottom: 5px;
        }

        .i-card p {
          opacity: 0.72;
          font-size: 0.9rem;
        }

        .i-card .note {
          opacity: 0.6;
          font-style: italic;
          margin-top: 4px;
        }

        .map-link {
          display: inline-block;
          margin-top: 10px;
          font-size: 0.85rem;
          color: var(--accent2);
          text-decoration: none;
          font-weight: 600;
        }

        footer {
          padding: 44px 0 40px;
          text-align: center;
        }

        .f-name {
          font-family: var(--display);
          font-size: 1.3rem;
          font-weight: 600;
        }

        .f-meta {
          opacity: 0.5;
          font-size: 0.82rem;
          margin-top: 4px;
        }

        .f-brand {
          opacity: 0.35;
          font-size: 0.72rem;
          margin-top: 14px;
          letter-spacing: 0.04em;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          z-index: 100;
          cursor: zoom-out;
        }

        .lightbox img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 4px;
        }

        .not-found {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
        }
      `}</style>
    </div>
  );
}

function RsvpForm({ slug, rsvpNote, fields }) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function updateField(label, value) {
    setValues((prev) => ({
      ...prev,
      [label]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus('submitting');
    setError('');

    try {
      await api.submitRsvp(slug, values);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rsvp-success">
        <div className="check">✓</div>
        <p>Thank you — your RSVP has been received.</p>
      </div>
    );
  }

  return (
    <div className="rsvp-box">

      {rsvpNote && (
        <p className="rsvp-note">
          {rsvpNote}
        </p>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {fields.map((f) => (
          <div className="field" key={f.label}>

            <label>{f.label}</label>

            {f.type === 'textarea' ? (
              <textarea
                rows={3}
                onChange={(e) =>
                  updateField(
                    f.label,
                    e.target.value
                  )
                }
              />
            ) : f.type === 'select' ? (
              <select
                onChange={(e) =>
                  updateField(
                    f.label,
                    e.target.value
                  )
                }
                defaultValue=""
              >
                <option value="" disabled>
                  Select...
                </option>

                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  f.type === 'number'
                    ? 'number'
                    : 'text'
                }
                onChange={(e) =>
                  updateField(
                    f.label,
                    e.target.value
                  )
                }
              />
            )}

          </div>
        ))}

        <button
          className="rsvp-btn"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <span className="spinner-dark" />
          ) : (
            'Send RSVP'
          )}
        </button>

      </form>

      <style>{`
        .rsvp-box {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }

        .rsvp-note {
          opacity: 0.65;
          margin-bottom: 26px;
          font-size: 0.92rem;
        }

        .rsvp-box form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rsvp-box .field label {
          font-size: 0.74rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 5px;
          display: block;
        }

        .rsvp-box input,
        .rsvp-box select,
        .rsvp-box textarea {
          width: 100%;
          border: none;
          border-bottom: 1px solid var(--line);
          background: transparent;
          font-family: var(--body);
          font-size: 1rem;
          padding: 7px 2px;
          color: var(--ink);
        }

        .rsvp-box input:focus,
        .rsvp-box select:focus,
        .rsvp-box textarea:focus {
          outline: none;
          border-bottom-color: var(--accent2);
        }

        .rsvp-btn {
          margin-top: 8px;
          align-self: center;
          padding: 13px 38px;
          background: var(--accent2);
          color: #fff;
          border: none;
          font-family: var(--body);
          font-size: 0.88rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 3px;
          min-width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-dark {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .rsvp-success {
          text-align: center;
          padding: 30px 0;
        }

        .rsvp-success .check {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--accent2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 1.4rem;
        }
      `}</style>
    </div>
  );
}