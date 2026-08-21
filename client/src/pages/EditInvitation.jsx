
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TimelineEditor from '../components/TimelineEditor';
import VenueEditor from '../components/VenueEditor';
import PhotoUploader from '../components/PhotoUploader';
import { api } from '../api';

export default function EditInvitation() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const justCreated = params.get('created') === '1';

  const [invite, setInvite] = useState(null);
  const [config, setConfig] = useState(null);

  const [form, setForm] = useState({
    title: '',
    eventDate: '',
    location: '',
    storyText: ''
  });

  const [timeline, setTimeline] = useState([]);
  const [venues, setVenues] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [rsvps, setRsvps] = useState([]);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getInvitation(id),
      api.eventTypes(),
      api.getRsvps(id)
    ])
      .then(([inv, all, rs]) => {
        setInvite(inv);
        setConfig(all[inv.eventType]);

        setForm({
          title: inv.title,
          eventDate: inv.eventDate,
          location: inv.location,
          storyText: inv.storyText || ''
        });

        setTimeline(inv.timeline || []);
        setVenues(inv.venues || []);
        setPhotos(inv.photos || []);
        setRsvps(rs);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();

    setError('');
    setSaved(false);
    setLoading(true);

    try {
      const updated = await api.updateInvitation(id, {
        ...form,
        timeline,
        venues,
        photos
      });

      setInvite(updated);
      setSaved(true);

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getShareUrl() {
    return `https://eventinvite.onrender.com/i/${invite.slug}`;
  }

  async function copyLink() {
    const url = getShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      alert('Invitation link copied!');
    } catch (err) {
      alert('Unable to copy the invitation link.');
    }
  }

  async function shareInvitation() {
    const url = getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: invite.title || 'EventInvite',
          text: `You're invited to ${invite.title}!`,
          url: url
        });
      } catch (err) {
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      alert(
        `Sharing is not supported on this browser.\n\nInvitation link copied:\n${url}`
      );
    } catch (err) {
      alert(
        `Unable to share the invitation.\n\nInvitation link:\n${url}`
      );
    }
  }

  if (!invite || !config) {
    return (
      <div>
        <Navbar />

        <div
          className="container"
          style={{ padding: 40 }}
        >
          {error ? (
            <p className="error-banner">
              {error}
            </p>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    );
  }

  const liveUrl = getShareUrl();

  return (
    <div
      style={{
        '--site-accent': config.theme.accent,
        '--site-card': config.theme.card
      }}
    >
      <Navbar />

      <div className="container form-wrap">

        <div className="form-head">
          <span className="ic">
            {config.icon}
          </span>

          <div>
            <h1>
              Edit {invite.title}
            </h1>

            <p>
              {config.label} invitation
            </p>
          </div>
        </div>

        {justCreated && (
          <div className="success-banner">
            Your invitation is live! Share this link with your guests:{' '}
            <strong>{liveUrl}</strong>
          </div>
        )}

        <div className="share-bar">

          <div>
            <div className="share-label">
              Your shareable link
            </div>

            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              {liveUrl}
            </a>
          </div>

          <div className="share-actions">

            <button
              className="btn btn-outline btn-sm"
              onClick={copyLink}
              type="button"
            >
              Copy Link
            </button>

            <button
              className="btn btn-sm share-btn"
              onClick={shareInvitation}
              type="button"
            >
              Share Invitation
            </button>

            <Link
              className="btn btn-outline btn-sm"
              to={`/i/${invite.slug}`}
              target="_blank"
            >
              View Live
            </Link>

          </div>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {saved && (
          <div className="success-banner">
            Changes saved.
          </div>
        )}

        <form onSubmit={handleSave}>

          <div className="form-card">
            <h2>The Basics</h2>

            {config.formFields.map((f) => (
              <div
                className="field"
                key={f.name}
              >
                <label>
                  {f.label}
                  {f.required && ' *'}
                </label>

                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.name] || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.name]: e.target.value
                      })
                    }
                  />
                ) : (
                  <input
                    value={form[f.name] || ''}
                    required={f.required}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.name]: e.target.value
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-card">
            <h2>
              {config.scheduleTitle}
            </h2>

            <TimelineEditor
              items={timeline}
              onChange={setTimeline}
            />
          </div>

          <div className="form-card">
            <h2>
              {config.infoTitle}
            </h2>

            <VenueEditor
              items={venues}
              onChange={setVenues}
            />
          </div>

          <div className="form-card">
            <h2>Photos</h2>

            <PhotoUploader
              photos={photos}
              onChange={setPhotos}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px'
            }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Save Changes'
            )}
          </button>

        </form>

        <div
          className="form-card"
          id="rsvps"
          style={{ marginTop: 30 }}
        >

          <div className="rsvp-head">

            <h2>
              RSVP Responses ({rsvps.length})
            </h2>

            {rsvps.length > 0 && (
              <a
                className="btn btn-outline btn-sm"
                href={api.exportRsvpsUrl(id)}
              >
                Download CSV
              </a>
            )}

          </div>

          {rsvps.length === 0 && (
            <p className="hint">
              No responses yet — they'll show up here as guests RSVP.
            </p>
          )}

          {rsvps.length > 0 && (
            <div className="rsvp-table-wrap">

              <table className="rsvp-table">

                <thead>
                  <tr>
                    <th>Submitted</th>

                    {Object.keys(
                      rsvps[0].responses
                    ).map((k) => (
                      <th key={k}>
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  {rsvps.map((r) => (
                    <tr key={r._id}>

                      <td>
                        {new Date(
                          r.submittedAt
                        ).toLocaleDateString()}
                      </td>

                      {Object.keys(
                        rsvps[0].responses
                      ).map((k) => (
                        <td key={k}>
                          {r.responses[k]}
                        </td>
                      ))}

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      <style>{`

        .form-wrap {
          padding-bottom: 70px;
        }

        .form-head {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 40px 0 20px;
        }

        .form-head .ic {
          font-size: 2rem;
        }

        .form-head h1 {
          font-size: 1.6rem;
        }

        .form-head p {
          opacity: 0.6;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        .share-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: var(--site-card);
          border: 1px solid var(--site-line);
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .share-label {
          font-size: 0.76rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--site-accent);
          margin-bottom: 3px;
        }

        .share-bar a {
          font-size: 0.92rem;
          word-break: break-all;
        }

        .share-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.82rem;
        }

        .share-btn {
          background: var(--site-accent);
          color: #fff;
          border: 1px solid var(--site-accent);
        }

        .share-btn:hover {
          opacity: 0.9;
        }

        .form-card {
          background: var(--site-card);
          border: 1px solid var(--site-line);
          border-radius: 6px;
          padding: 26px 24px;
          margin-bottom: 18px;
        }

        .form-card h2 {
          font-size: 1.15rem;
          margin-bottom: 18px;
        }

        .rsvp-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .rsvp-head h2 {
          margin-bottom: 0;
        }

        .rsvp-table-wrap {
          overflow-x: auto;
        }

        .rsvp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .rsvp-table th,
        .rsvp-table td {
          text-align: left;
          padding: 9px 12px;
          border-bottom: 1px solid var(--site-line);
          white-space: nowrap;
        }

        .rsvp-table th {
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          opacity: 0.6;
        }

        @media (max-width: 600px) {

          .share-actions {
            width: 100%;
          }

          .share-actions .btn {
            flex: 1;
          }

        }

      `}</style>

    </div>
  );
}
