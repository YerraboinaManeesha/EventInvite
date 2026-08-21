const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. CSV download handled separately)
  }

  if (!res.ok) {
    throw new Error((data && data.error) || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  // auth
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  // event types config
  eventTypes: () => request('/event-types'),

  // invitations (owner)
  createInvitation: (body) => request('/invitations', { method: 'POST', body: JSON.stringify(body) }),
  myInvitations: () => request('/invitations/mine'),
  getInvitation: (id) => request(`/invitations/${id}`),
  updateInvitation: (id, body) => request(`/invitations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteInvitation: (id) => request(`/invitations/${id}`, { method: 'DELETE' }),
  getRsvps: (id) => request(`/invitations/${id}/rsvps`),
  exportRsvpsUrl: (id) => `${BASE}/api/invitations/${id}/rsvps/export`,

  // public
  getPublicInvitation: (slug) => request(`/public/invitations/${slug}`),
  submitRsvp: (slug, responses) =>
    request(`/public/invitations/${slug}/rsvp`, { method: 'POST', body: JSON.stringify({ responses }) })
};
