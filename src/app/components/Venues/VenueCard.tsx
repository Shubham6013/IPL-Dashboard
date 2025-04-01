"use client";
import React from "react";
import "./Venues.css";

interface VenueProps {
  name: string;
  city: string;
  image: string;
  detailsUrl: string;
}

const VenueCard: React.FC<VenueProps> = ({ name, city, image, detailsUrl }) => {
  return (
    <div className="venue-card">
      <img src={image} alt={name} className="venue-image" />
      <div className="venue-info">
        <h3>{name}</h3>
        <p>{city}</p>
        <a href={detailsUrl} target="_blank" rel="noopener noreferrer" className="details-button">
          View Details
        </a>
      </div>
    </div>
  );
};

export default VenueCard;
