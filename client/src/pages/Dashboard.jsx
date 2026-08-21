import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [invites, setInvites] = useState(null);
  const [eventTypes, setEventTypes] = useState({});
  const [rsvpStats, setRsvpStats] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    api.myInvitations().then(async (data) => {
      setInvites(data);

      const stats = {};

      await Promise.all(
        data.map(async (inv) => {
          try {
            const rsvps = await api.getRsvps(inv._id);

            let attending = 0;
            let notAttending = 0;
            let guests = 0;

            rsvps.forEach((rsvp) => {
              const responses = rsvp.responses || {};

              const attendingValue = Object.values(responses).find((value) =>
                typeof value === 'string' &&
                (
                  value.toLowerCase().includes('accept') ||
                  value.toLowerCase().includes('attending') ||
                  value.toLowerCase().includes('there') ||
                  value.toLowerCase() === 'yes' ||
                  value.toLowerCase().includes('confirmed') ||
                  value.toLowerCase().includes('count me in') ||
                  value.toLowerCase().includes('joyfully')
                )
              );

              const notAttendingValue = Object.values(responses).find((value) =>
                typeof value === 'string' &&
                (
                  value.toLowerCase().includes('decline') ||
                  value.toLowerCase().includes("can't") ||
                  value.toLowerCase().includes('cannot') ||
                  value.toLowerCase().includes('sorry') ||
                  value.toLowerCase().includes('not attend')
                )
              );

              if (attendingValue) {
                attending++;
              } else if (notAttendingValue) {
                notAttending++;
              }

              Object.entries(responses).forEach(([key, value]) => {
                if (
                  typeof value === 'string' &&
                  (
                    key.toLowerCase().includes('guest') ||
                    key.toLowerCase().includes('number')
                  )
                ) {
                  const number = parseInt(value, 10);

                  if (!isNaN(number)) {
                    guests += number;
                  }
                }
              });
            });

            stats[inv._id] = {
              responses: rsvps.length,
              attending,
              notAttending,
              guests
            };
          } catch {
            stats[inv._id] = {
              responses: 0,
              attending: 0,
              notAttending: 0,
              guests: 0
            };
          }
        })
      );

      setRsvpStats(stats);
    }).catch(() => setInvites([]));

    api.eventTypes().then(setEventTypes).catch(() => {});
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this invitation? This cannot be undone.')) return;

    await api.deleteInvitation(id);

    setInvites((prev) => prev.filter((i) => i._id !== id));

    setRsvpStats((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  return (
    <div>
      <Navbar />

      <div className="container">

        <div className="dash-head">
          <div>
            <h1>Hi {user?.name?.split(' ')[0] || 'there'}</h1>
            <p>Your invitations, all in one place.</p>
          </div>

          <Link to="/create" className="btn btn-primary">
            + New Invitation
          </Link>
        </div>

        {invites === null && (
          <p className="muted">Loading...</p>
        )}

        {invites && invites.length === 0 && (
          <div className="empty-state">
            <p>You haven't created an invitation yet.</p>

            <Link to="/create" className="btn btn-primary">
              Create your first one
            </Link>
          </div>
        )}

        <div className="invite-list">

          {invites && invites.map((inv) => {

            const config = eventTypes[inv.eventType];

            const stats = rsvpStats[inv._id] || {
              responses: 0,
              attending: 0,
              notAttending: 0,
              guests: 0
            };

            return (
              <div
                className="invite-row"
                key={inv._id}
                style={{
                  borderLeftColor:
                    config?.theme?.accent || '#ccc'
                }}
              >

                <div className="invite-top">

                  <div className="invite-info">

                    <span className="invite-icon">
                      {config?.icon}
                    </span>

                    <div>
                      <div className="invite-title">
                        {inv.title}
                      </div>

                      <div className="invite-meta">
                        {config?.label} · {inv.eventDate}
                      </div>
                    </div>

                  </div>

                  <div className="invite-actions">

                    <Link
                      to={`/i/${inv.slug}`}
                      target="_blank"
                      className="btn btn-outline btn-sm"
                    >
                      View Live
                    </Link>

                    <Link
                      to={`/edit/${inv._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/edit/${inv._id}#rsvps`}
                      className="btn btn-outline btn-sm"
                    >
                      RSVPs
                    </Link>

                    <button
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => handleDelete(inv._id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* RSVP Statistics */}

                <div className="rsvp-section">

                  <div className="rsvp-title">
                    RSVP Statistics
                  </div>

                  <div className="rsvp-stats">

                    <div className="stat-card">
                      <span className="stat-number">
                        {stats.responses}
                      </span>

                      <span className="stat-label">
                        Responses
                      </span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-number">
                        {stats.attending}
                      </span>

                      <span className="stat-label">
                        Attending
                      </span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-number">
                        {stats.notAttending}
                      </span>

                      <span className="stat-label">
                        Not Attending
                      </span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-number">
                        {stats.guests}
                      </span>

                      <span className="stat-label">
                        Guests
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      <style>{`

        .dash-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px 0 30px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dash-head h1 {
          font-size: 1.8rem;
        }

        .dash-head p {
          opacity: 0.6;
          font-size: 0.92rem;
          margin-top: 4px;
        }

        .muted {
          opacity: 0.6;
          padding: 20px 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--site-card);
          border: 1px dashed var(--site-line);
          border-radius: 6px;
          margin-bottom: 30px;
        }

        .empty-state p {
          margin-bottom: 18px;
          opacity: 0.65;
        }

        .invite-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 60px;
        }

        .invite-row {
          background: var(--site-card);
          border: 1px solid var(--site-line);
          border-left: 4px solid #ccc;
          border-radius: 5px;
          padding: 18px;
        }

        .invite-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .invite-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .invite-icon {
          font-size: 1.5rem;
        }

        .invite-title {
          font-weight: 600;
          font-family: 'Fraunces', serif;
        }

        .invite-meta {
          font-size: 0.82rem;
          opacity: 0.6;
        }

        .invite-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-sm {
          padding: 7px 14px;
          font-size: 0.8rem;
        }

        .btn-danger {
          color: #A33;
          border-color: #EBC;
        }

        /* RSVP SECTION */

        .rsvp-section {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--site-line);
        }

        .rsvp-title {
          font-family: 'Fraunces', serif;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .rsvp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
        }

        .stat-card {
          background: var(--site-card);
          border: 1px solid var(--site-line);
          border-radius: 6px;
          padding: 12px 14px;
          text-align: center;
          min-height: 70px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .stat-number {
          display: block;
          font-family: 'Fraunces', serif;
          font-size: 1.35rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .stat-label {
          display: block;
          font-size: 0.68rem;
          opacity: 0.6;
          margin-top: 4px;
        }

        @media (max-width: 720px) {

          .rsvp-stats {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 480px) {

          .rsvp-stats {
            grid-template-columns: 1fr 1fr;
          }

          .invite-actions {
            width: 100%;
          }

          .invite-actions .btn {
            flex: 1;
          }

        }

      `}</style>
    </div>
  );
}