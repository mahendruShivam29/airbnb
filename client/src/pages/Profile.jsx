import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [me, setMe] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Initialize with context data first
      setMe({ ...user });
      loadFreshData();
    }
  }, [user]);

  const loadFreshData = async () => {
    try {
      const endpoint = user.role === 'TRAVELER' ? '/traveler/auth/me' : '/owner/auth/me';
      const r = await api.get(endpoint);
      setMe(r.data.user);
    } catch (e) {
      console.error("Failed to load fresh profile data", e);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const endpoint = user.role === 'TRAVELER' ? '/traveler/auth/me' : '/owner/auth/me';

      // Prepare body
      const { _id, id, email, role, passwordHash, ...editableFields } = me;

      await api.put(endpoint, editableFields);
      setMsg('Saved successfully');

      // Update context
      setUser({ ...user, ...editableFields });
    } catch (e) {
      console.error(e);
      setMsg('Failed to save');
    }
  };

  const upload = async () => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('avatar', file);

      const endpoint = user.role === 'TRAVELER' ? '/traveler/auth/avatar' : '/owner/auth/avatar';
      const r = await api.post(endpoint, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMe({ ...me, avatarUrl: r.data.avatarUrl });
      setUser({ ...user, avatarUrl: r.data.avatarUrl });
      setMsg('Avatar uploaded');
    } catch (e) {
      console.error(e);
      setMsg('Upload failed');
    }
  };

  if (loading && !me) return <div className="p-8">Loading...</div>;
  if (!me) return <div className="p-8">User not found</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-3 rounded-xl"
            placeholder="First Name"
            value={me.firstName || ''}
            onChange={e => setMe({ ...me, firstName: e.target.value })}
          />
          <input
            className="border p-3 rounded-xl"
            placeholder="Last Name"
            value={me.lastName || ''}
            onChange={e => setMe({ ...me, lastName: e.target.value })}
          />

          <input
            className="border p-3 rounded-xl bg-gray-50"
            placeholder="Email"
            value={me.email || ''}
            disabled
            title="Email cannot be changed"
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Phone"
            value={me.phone || ''}
            onChange={e => setMe({ ...me, phone: e.target.value })}
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="City"
            value={me.city || ''}
            onChange={e => setMe({ ...me, city: e.target.value })}
          />

          <select
            className="border p-3 rounded-xl"
            value={me.state || ''}
            onChange={e => setMe({ ...me, state: e.target.value })}
          >
            <option value="">State</option>
            {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="border p-3 rounded-xl"
            value={me.country || 'USA'}
            onChange={e => setMe({ ...me, country: e.target.value })}
          >
            {['USA', 'Canada', 'UK', 'India', 'Australia'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            className="border p-3 rounded-xl md:col-span-2"
            placeholder="Languages (comma separated)"
            value={me.languages || ''}
            onChange={e => setMe({ ...me, languages: e.target.value })}
          />

          <select
            className="border p-3 rounded-xl"
            value={me.gender || ''}
            onChange={e => setMe({ ...me, gender: e.target.value })}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>

          <textarea
            className="border p-3 rounded-xl md:col-span-2"
            placeholder="About me"
            value={me.about || ''}
            onChange={e => setMe({ ...me, about: e.target.value })}
          ></textarea>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button onClick={save} className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-black transition">
            Save Changes
          </button>
          {msg && <span className={`text-sm ${msg.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{msg}</span>}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 h-fit">
        <h2 className="font-semibold mb-3">Profile picture</h2>
        <div className="flex flex-col items-center">
          {me.avatarUrl ? (
            <img
              src={`http://localhost:${user.role === 'TRAVELER' ? '4001' : '4003'}${me.avatarUrl}`}
              alt="avatar"
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <span className="text-4xl">?</span>
            </div>
          )}

          <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition w-full text-center">
            Choose Image
            <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {file.name}
            </div>
          )}

          <button
            onClick={upload}
            disabled={!file}
            className={`mt-2 w-full px-4 py-2 rounded-xl text-white transition ${!file ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
