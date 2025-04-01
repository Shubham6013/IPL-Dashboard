"use client";
import { useEffect, useState } from "react";
import "./Venues.css";

interface Venue {
  name: string;
  type: string;
  city: string;
  link: string;
  image: string;
}

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("/api/venues");

        if (!response.ok) {
          throw new Error(`Failed to fetch venues. Status: ${response.status}`);
        }

        const data = await response.json();
        setVenues(data.venues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="venue-container">
      <h2 className="title">IPL Venues</h2>
      <div className="venues-grid">
        {venues.map((venue, index) => (
          <div key={index} className="venue-card">
            <a href={venue.link} target="_blank" rel="noopener noreferrer">
              <img src={venue.image} alt={venue.name} className="venue-image" />
              <div className="venue-info">
                <h3>{venue.name}</h3>
                <p>{venue.city}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;
