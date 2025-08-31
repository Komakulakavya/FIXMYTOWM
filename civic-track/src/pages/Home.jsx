import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/pexels-jibarofoto-2339722.jpg';
import img2 from '../assets/boy-girl-plastic-garbage-collection.jpg';
import img3 from '../assets/pexels-tkirkgoz-11794520.jpg';
import img4 from '../assets/blurred-nightlights-city.jpg';
import Footer from '../components/Footer';

const heroImages = [img1, img2, img3, img4];

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative flex-1 h-[90vh] overflow-hidden">
        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Slide ${i}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="relative z-20 text-white py-40 px-6 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Empowering Communities <br /> to Take Action
          </h2>
          <p className="text-xl mb-8 drop-shadow-md">
            CivicTrack lets citizens report local issues, track resolutions, and collaborate with authorities & volunteers.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#124E66' }}
            className="hover:brightness-110 text-white text-lg font-medium py-3 px-8 rounded-full transition duration-300 shadow-md"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-[#124E66]">Welcome to CivicTrack</h2>
            <p className="text-gray-600 mb-6">Please choose an option:</p>
            <div className="flex justify-around mb-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#124E66] hover:brightness-110 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#124E66] hover:brightness-110 text-white px-4 py-2 rounded-lg transition"
              >
                Login
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="bg-white py-20 px-6 text-center">
        <h3 className="text-4xl font-semibold mb-6 text-[#124E66]">About CivicTrack</h3>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          CivicTrack is a powerful civic engagement platform that connects the public with municipal authorities and volunteers.
          Designed for transparency and accountability, it enables users to track issue progress and collaborate for better communities.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-20 px-6 text-center">
        <h3 className="text-4xl font-semibold mb-10 text-[#124E66]">Key Features</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Report Issues",
              desc: "Submit problems with location, media, and details.",
            },
            {
              title: "Track Progress",
              desc: "Follow real-time updates on resolution status.",
            },
            {
              title: "Volunteer Portal",
              desc: "Get involved and help resolve local problems.",
            },
            {
              title: "Data Insights",
              desc: "Analyze reports with charts and stats for better decisions.",
            },
            {
              title: "Community Engagement",
              desc: "Collaborate with neighbors and share updates on issues.",
            },
            {
              title: "Authority Dashboard",
              desc: "Authorities can manage, prioritize, and resolve complaints efficiently.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300"
            >
              <h4 className="text-2xl font-semibold mb-2 text-[#124E66]">{title}</h4>
              <p className="text-gray-600 text-md">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-20 px-6 text-center">
        <h3 className="text-4xl font-semibold mb-10 text-[#124E66]">What People Say</h3>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8 max-w-6xl mx-auto">
          {[
            {
              text: "I reported a pothole in my area and CivicTrack helped authorities take quick action. Really useful app!",
              author: "Ramesh, Hyderabad",
              role: "General User",
            },
            {
              text: "I volunteered to assist in cleaning drives, and CivicTrack connected me with the right people. Great initiative!",
              author: "Priya, Bangalore",
              role: "Volunteer",
            },
            {
              text: "CivicTrack simplified how we monitor public complaints and respond faster.",
              author: "GHMC Officer",
              role: "Authority",
            },
          ].map(({ text, author, role }, i) => (
            <div
              key={i}
              className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="italic mb-4">"{text}"</p>
              <h4 className="font-semibold">{author}</h4>
              <span className="text-sm text-gray-500">{role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20 px-6 text-center">
        <h3 className="text-4xl font-semibold mb-6 text-[#124E66]">Contact Us</h3>
        <form className="max-w-xl mx-auto space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-[#124E66]"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-[#124E66]"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:outline-[#124E66]"
          />
          <button
            type="submit"
            className="bg-[#124E66] text-white px-8 py-3 rounded-full hover:brightness-110 transition shadow-md"
          >
            Send Message
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Home;