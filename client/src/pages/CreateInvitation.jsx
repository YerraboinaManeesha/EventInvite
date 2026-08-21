import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TimelineEditor from '../components/TimelineEditor';
import VenueEditor from '../components/VenueEditor';
import PhotoUploader from '../components/PhotoUploader';
import { api } from '../api';

export default function CreateInvitation() {
  const { eventType } = useParams();
  const navigate = useNavigate();

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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.eventTypes()
      .then((all) => {
        const c = all[eventType];

        if (!c) {
          navigate('/create');
          return;
        }

        setConfig(c);
      })
      .catch(() => {
        navigate('/create');
      });
  }, [eventType, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const invite = await api.createInvitation({
        eventType,
        ...form,
        timeline,
        venues,
        photos
      });

      navigate(`/edit/${invite._id}?created=1`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!config) {
    return (
      <div>
        <Navbar />
      </div>
    );
  }

  return (
    <div
      style={{
        '--site-accent': config.theme.accent,
        '--site-card': config.theme.card
      }}
    >
      <Navbar />

      <div className="container form-wrap">

        <div className="back-row">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/create')}
          >
            ← Back to Event Types
          </button>
        </div>

        <div className="form-head">
          <span className="ic">
            {config.icon}
          </span>

          <div>
            <h1>
              New {config.label} Invitation
            </h1>

            <p>
              Fill in the essentials — you can add photos and edit anytime after.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
                    placeholder={f.placeholder}
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
                    placeholder={f.placeholder}
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
              'Create Invitation'
            )}
          </button>

        </form>
      </div>

      <style>{`
        .back-row {
          padding-top: 24px;
        }

        .back-btn {
          border: none;
          background: transparent;
          color: var(--site-accent);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 0;
        }

        .back-btn:hover {
          opacity: 0.7;
        }

        .form-wrap {
          padding-bottom: 70px;
        }

        .form-head {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 25px 0 30px;
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
      `}</style>
    </div>
  );
}