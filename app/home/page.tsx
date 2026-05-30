'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Child {
  _id: string;
  childName: string;
  extensionId: string;
  parentEmail: string;
}

interface HistoryItem {
  _id: string;
  url: string;
  title: string;
  time: string;
}

interface LocationItem {
  _id: string;
  latitude: number;
  longitude: number;
  time: string;
}

const letters = ['K', 'I', 'D', 'S', 'L', '💚', 'X'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'location'>('history');
  const [showAddModal, setShowAddModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [extensionId, setExtensionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/auth/sign-in'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetchChildren(u.email);
  }, []);

  const fetchChildren = async (email: string) => {
    const res = await fetch(`/api/children?parentEmail=${encodeURIComponent(email)}`);
    const data = await res.json();
    setChildren(data.children || []);
  };

  const fetchChildData = async (child: Child) => {
    setSelectedChild(child);
    setDataLoading(true);
    const [histRes, locRes] = await Promise.all([
      fetch(`/api/children/history?extensionId=${child.extensionId}`),
      fetch(`/api/children/location?extensionId=${child.extensionId}`),
    ]);
    const histData = await histRes.json();
    const locData = await locRes.json();
    setHistory(histData.history || []);
    setLocations(locData.locations || []);
    setDataLoading(false);
  };

  const handleAddChild = async () => {
    if (!childName.trim() || !extensionId.trim()) { setError('Both fields are required'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentEmail: user?.email, childName, extensionId }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setLoading(false); return; }
    setShowAddModal(false);
    setChildName('');
    setExtensionId('');
    setLoading(false);
    fetchChildren(user!.email);
  };

  const handleDeleteChild = async (e: React.MouseEvent, childId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this child?')) return;
    await fetch(`/api/children?id=${childId}`, { method: 'DELETE' });
    if (selectedChild?._id === childId) setSelectedChild(null);
    fetchChildren(user!.email);
  };

  const handleLogout = () => { localStorage.removeItem('user'); router.push('/auth/sign-in'); };
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const getGreeting = () => { const h = new Date().getHours(); if (h < 12) return 'Good morning'; if (h < 17) return 'Good afternoon'; return 'Good evening'; };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f0faf4] font-nunito">

      {/* Top bar */}
      <div className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          {letters.map((l, i) => <span key={i} className="text-lg font-black text-green-600">{l}</span>)}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-xs font-bold text-green-700">
            {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 font-semibold">{user.email}</span>
          <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 transition">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">

        {/* Greeting */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-800">{getGreeting()}, {firstName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Monitor your children's activity</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
          >
            + Add Child
          </button>
        </div>

        {/* Children Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {children.length === 0 && (
            <div className="md:col-span-3 bg-white rounded-2xl border border-green-100 p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">👶</p>
              <p className="font-bold">No children added yet</p>
              <p className="text-sm mt-1">Click "Add Child" to link an extension</p>
            </div>
          )}
          {children.map((child) => (
            <div
              key={child._id}
              onClick={() => fetchChildData(child)}
              className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer transition hover:border-green-400 ${selectedChild?._id === child._id ? 'border-green-500 ring-2 ring-green-200' : 'border-green-100'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-black text-green-700">
                  {child.childName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-800">{child.childName}</p>
                  <p className="text-xs text-gray-400">{child.extensionId}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteChild(e, child._id)}
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition flex-shrink-0"
                >
                  🗑️
                </button>
              </div>
              <p className="text-xs text-green-600 font-semibold">Click to view activity →</p>
            </div>
          ))}
        </div>

        {/* Data Panel — outside the grid */}
        {selectedChild && (
          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition ${activeTab === 'history' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                🌐 Browsing History
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition ${activeTab === 'location' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                📍 Locations
              </button>
            </div>

            {dataLoading ? (
              <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
            ) : activeTab === 'history' ? (
              history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No history found yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.map((item) => (
                    <div key={item._id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{item.title || 'No title'}</p>
                        <p className="text-xs text-blue-500 truncate">{item.url}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{item.time}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              locations.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No locations found yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {locations.map((loc) => (
                    <div key={loc._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">📍</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">
                          {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
                        </p>
                        
                         <a href={`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{loc.time}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-black text-gray-800 mb-1">Add Child</h2>
            <p className="text-sm text-gray-500 mb-4">Enter the child's name and the Extension ID shown on the welcome page</p>
            <input
              type="text"
              placeholder="Child's name"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-green-400 text-gray-800 placeholder-gray-400 bg-white"
            />
            <input
              type="text"
              placeholder="Extension ID (e.g. EXT-XXXXXXXX)"
              value={extensionId}
              onChange={e => setExtensionId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-green-400 text-gray-800 placeholder-gray-400 bg-white"
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAddModal(false); setError(''); }}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Add Child'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}