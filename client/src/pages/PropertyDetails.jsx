import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
const SERVER = 'http://localhost:4000';

export default function PropertyDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const r = await api.get(`/properties/${id}`);
      setP(r.data);
    })();
  }, [id]);

  const book = async () => {
    setMsg(''); setErr('');
    try {
      await api.post('/bookings', { propertyId: id, startDate: start, endDate: end, guests });
      setMsg('Booking request sent! (Pending)');
    } catch (e) {
      setErr(e.response?.data?.error || 'Booking failed');
    }
  };

  if (!p) return <div>Loading…</div>;

  const photos = Array.isArray(p.photos) ? p.photos : [];
  const ams = Array.isArray(p.amenities) ? p.amenities : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{p.name}</h1>
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map(u => <img key={u} src={`${SERVER}${u}`} alt="" className="rounded-xl object-cover w-full h-48" />)}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3 bg-white rounded-2xl p-4 shadow">
          <div className="text-sm text-gray-600">{[p.city, p.state, p.country].filter(Boolean).join(', ')}</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div><strong>Type:</strong> {p.type}</div>
            <div><strong>Bedrooms:</strong> {p.bedrooms}</div>
            <div><strong>Bathrooms:</strong> {p.bathrooms}</div>
            <div><strong>Max guests:</strong> {p.maxGuests}</div>
            <div><strong>Price/night:</strong> ${p.pricePerNight}</div>
            <div><strong>Available:</strong> {(p.availableFrom ? new Date(p.availableFrom).toLocaleDateString() : '—')} – {(p.availableTo ? new Date(p.availableTo).toLocaleDateString() : '—')}</div>
          </div>
          <p className="text-sm">{p.description}</p>
          {ams.length > 0 && (
            <div>
              <strong>Amenities:</strong>
              <ul className="list-disc ml-6">{ams.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Book this place</h3>
          {err && <div className="mb-2 bg-rose-50 text-rose-700 p-2 rounded">{err}</div>}
          {msg && <div className="mb-2 bg-green-50 text-green-700 p-2 rounded">{msg}</div>}
          <div className="space-y-2">
            <input
              type={start ? "date" : "text"}
              className="border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-gray-700"
              placeholder="Check in"
              value={start}
              onChange={e => setStart(e.target.value)}
              onFocus={(e) => e.target.type = "date"}
            />
            <input
              type={end ? "date" : "text"}
              className="border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-gray-700"
              placeholder="Check out"
              value={end}
              onChange={e => setEnd(e.target.value)}
              onFocus={(e) => e.target.type = "date"}
            />
            <input
              type="number"
              min={1}
              className="border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-gray-700"
              placeholder="Guests"
              value={guests}
              onChange={e => setGuests(e.target.value)}
            />
            <button onClick={book} className="w-full rounded-xl bg-[#FF385C] hover:bg-[#E31C5F] text-white py-3 font-medium transition">Request booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
