import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Leaflet and React-Leaflet imports
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const COLORS = ['#124E66', '#82ca9d', '#FFBB28', '#FF8042'];

const AuthorityDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    sortBy: 'newest'
  });
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/issues/filter?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users?role=volunteer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(res.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchVolunteers();
  }, [filters]);

  const updateStatus = async (issueId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/issues/${issueId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIssues();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const assignVolunteer = async (issueId, volunteerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/issues/${issueId}/assign`, { volunteerId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIssues();
    } catch (error) {
      console.error('Error assigning volunteer:', error);
    }
  };

  const total = issues.length;
  const statusCount = ['Pending', 'In Progress', 'Resolved'].map(status => ({
    name: status,
    value: issues.filter(i => i.status === status).length
  }));

  const categoryCount = Array.from(
    issues.reduce((map, issue) => {
      map.set(issue.category, (map.get(issue.category) || 0) + 1);
      return map;
    }, new Map())
  ).map(([name, value]) => ({ name, value }));

  const filteredIssues = issues.filter(issue => {
    const term = searchTerm.toLowerCase();
    return (
      (issue.title && issue.title.toLowerCase().includes(term)) ||
      (issue.category && issue.category.toLowerCase().includes(term)) ||
      (issue.status && issue.status.toLowerCase().includes(term)) ||
      (issue.reporterId?.username && issue.reporterId.username.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>
      <main>
        <h2 className="text-3xl font-bold text-[#124E66] mb-6">Authority Dashboard</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-[#124E66]">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-[#124E66]">
              <option value="">All</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Electricity">Electricity</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Garbage Dump">Garbage Dump</option>
              <option value="Street Light">Street Light</option>
              <option value="Traffic Signal">Traffic Signal</option>
              <option value="Illegal Construction">Illegal Construction</option>
              <option value="Drainage Block">Drainage Block</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-[#124E66]">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, category, status, or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#124E66]"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
            <PieChart width={300} height={200}>
              <Pie data={statusCount} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {statusCount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Category Distribution</h3>
            <BarChart width={350} height={200} data={categoryCount}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#124E66" />
            </BarChart>
          </div>
        </div>

        <p className="text-gray-700 mb-4 text-lg">📊 Total Issues: <strong>{total}</strong></p>

        {/* Issue Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedIssue(issue)}
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {issue.title || 'No Title'}
                </h3>
                <p className="text-gray-600">{issue.description}</p>
                <div className="text-sm text-gray-700 mt-2">
                  <p>🛠️ Status: <strong>{issue.status}</strong></p>
                  <p>🏷️ Category: <strong>{issue.category}</strong></p>
                </div>
                {issue.photos && issue.photos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {issue.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5000${photo}`}
                        alt={`Issue ${i}`}
                        className="rounded w-32 border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal for Expanded Issue */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
                onClick={() => setSelectedIssue(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-[#124E66]">
                {selectedIssue.title || 'No Title'}
              </h2>
              <p className="mb-2 text-gray-700">{selectedIssue.description}</p>
              
              {/* New: Map Section */}
              {selectedIssue.location && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>📍 Location:</strong>
                  </p>
                  <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[selectedIssue.location.latitude, selectedIssue.location.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[selectedIssue.location.latitude, selectedIssue.location.longitude]} />
                    </MapContainer>
                  </div>
                </div>
              )}
              {/* End of new map section */}

              <p className="text-sm text-gray-600 mb-1">🏠 Address: {selectedIssue.address}</p>
              <p className="text-sm text-gray-600 mb-1">📞 Contact: {selectedIssue.contact}</p>
              <p className="text-sm text-gray-600 mb-1">Status: <strong>{selectedIssue.status}</strong></p>
              <p className="text-sm text-gray-600 mb-1">Category: {selectedIssue.category}</p>
              <p className="text-sm text-gray-600 mb-3">Reported by: {selectedIssue.reporterId?.username}</p>
              {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {selectedIssue.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${photo}`}
                      alt={`Photo ${i}`}
                      className="rounded border w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuthorityDashboard;