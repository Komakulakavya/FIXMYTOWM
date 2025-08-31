import React, { useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Leaflet and React-Leaflet imports
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map clicks and marker placement
const LocationMarker = ({ setLocation, setAddress, location }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
      // Reverse geocode to get the address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(error => {
          console.error('Error fetching address:', error);
          setAddress('Address not found');
        });
    },
  });

  // Center the map on the newly selected location
  if (location) {
    map.setView(location, map.getZoom());
  }

  return location === null ? null : (
    <Marker position={location}></Marker>
  );
};

const ReportIssue = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(''); // We'll keep this for the resolved address
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null); // New: to store latitude and longitude
  const [isLoading, setIsLoading] = useState(false); // New: to handle loading state

  const mapRef = useRef();

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleCurrentLocationClick = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          setIsLoading(false);
          // Set the map view to the current location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
          // Reverse geocode to get the address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data.display_name) {
                setAddress(data.display_name);
              }
            })
            .catch(error => {
              console.error('Error fetching address:', error);
              setAddress('Address not found');
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Could not get your location. Please select it on the map.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please select a location on the map.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('contact', contact);
    formData.append('latitude', location.lat); // New: add latitude
    formData.append('longitude', location.lng); // New: add longitude
    
    photos.forEach((photo) => formData.append('photos', photo));

    try {
      await axios.post('http://localhost:5000/api/issues', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Issue reported successfully!');
      setCategory('');
      setDescription('');
      setAddress('');
      setContact('');
      setPhotos([]);
      setLocation(null); // Reset location
    } catch (err) {
      console.error(err);
      alert('Failed to report issue');
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-[#124E66] mb-6">📢 Report a Local Issue</h2>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-[#124E66]"
          >
            <option value="">Select Category</option>
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

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-[#124E66]"
            placeholder="Describe the issue..."
          ></textarea>
        </div>

        {/* Start of Location Component */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Select Location</label>
          <div className="border border-gray-300 rounded-lg overflow-hidden h-64 mb-2">
            <MapContainer
              center={[17.385044, 78.486671]} // Default center (Hyderabad, India)
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              whenCreated={mapInstance => { mapRef.current = mapInstance }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker setLocation={setLocation} setAddress={setAddress} location={location} />
            </MapContainer>
          </div>
          <button
            type="button"
            onClick={handleCurrentLocationClick}
            className="w-full bg-gray-500 text-white font-semibold py-2 rounded mb-2 hover:bg-opacity-90 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Getting Location...' : 'Use My Current Location'}
          </button>
          {location && (
            <div className="text-sm text-gray-600 mt-2">
              Selected Location: <b>Latitude:</b> {location.lat.toFixed(6)}, <b>Longitude:</b> {location.lng.toFixed(6)}
              <br/>
              {address && (
                <span className="font-bold">Address: {address}</span>
              )}
            </div>
          )}
        </div>
        {/* End of Location Component */}

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-[#124E66]"
            placeholder="e.g., 9876543210"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Upload Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#124E66] text-white font-semibold py-2 rounded hover:bg-opacity-90 transition"
        >
          Submit Issue
        </button>
      </form>
      <Footer />
    </>
  );
};

export default ReportIssue;