"use client";
import { useEffect, useState } from "react";
import "./Teams.css";

interface Team {
  name: string;
  logo: string;
  hoverLogo: string;
  url: string;
  trophies: string;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");

        if (!response.ok) {
          throw new Error(`Failed to fetch teams. Status: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="teams-container">
      <h2 className="title">IPL Teams</h2>
      <div className="teams-grid">
        {teams.map((team, index) => (
          <a key={index} href={team.url} target="_blank" rel="noopener noreferrer" className="team-card">
            <div className="logo-container">
              <img src={team.logo} alt={team.name} className="team-logo" />
              <img src={team.hoverLogo} alt={team.name} className="team-hover-logo" />
            </div>
            <div className="team-info">
              <h3>{team.name}</h3>
              <p className="trophies">🏆 {team.trophies}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Teams;
