import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Leaflet and React-Leaflet imports for the map
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

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/issues/my-issues', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIssues(response.data);
        setFilteredIssues(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = issues.filter(
      issue =>
        issue.category.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term)
    );
    setFilteredIssues(filtered);
  }, [searchTerm, issues]);

  if (loading) return <div className="text-center text-lg p-6">Loading issues...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (issues.length === 0) return <div className="text-center text-gray-600">No issues reported yet.</div>;

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 style={{ color: '#124E66' }} className="text-3xl font-bold mb-6 text-center text-gray-800">📋 My Reported Issues</h2>

        {/* 🔍 Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <ul className="space-y-6">
          {filteredIssues.map((issue) => (
            <li
              key={issue._id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{issue.category}</h3>
              <p className="text-gray-600 mb-3">{issue.description}</p>

              {issue.photos?.length > 0 && (
                <div className="flex gap-3 flex-wrap mb-3">
                  {issue.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${photo}`}
                      alt="Issue"
                      width="150"
                      className="rounded-md border"
                    />
                  ))}
                </div>
              )}

              {/* New: Display the map for the issue's location */}
              {issue.location && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>📍 Location:</strong>
                  </p>
                  <div className="h-48 w-full border border-gray-300 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[issue.location.latitude, issue.location.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[issue.location.latitude, issue.location.longitude]} />
                    </MapContainer>
                  </div>
                </div>
              )}
              {/* End of new map section */}

              {issue.address && (
                <p className="text-sm text-gray-500">
                  <strong>🏠 Address:</strong> {issue.address}
                </p>
              )}

              {issue.contact && (
                <p className="text-sm text-gray-500">
                  <strong>📞 Contact:</strong> {issue.contact}
                </p>
              )}

              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span><strong>Status:</strong> {issue.status}</span>
                <span><strong>Reported:</strong> {new Date(issue.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default MyIssues;