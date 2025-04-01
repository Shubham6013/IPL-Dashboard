"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./MatchSchedule.css";

interface Match {
  matchNumber: string;
  date: string;
  time: string;
  venue: string;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamLogo: string;
  matchUrl: string;
}

const MatchSchedule = () => {
  const [schedule, setSchedule] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/schedule");
        if (!response.ok) {
          throw new Error(`Failed to fetch schedule. Status: ${response.status}`);
        }
        const data = await response.json();
        setSchedule(data.schedule);
      } catch (error) {
        console.error("Error fetching match schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="match-container">
      <h2 className="title">IPL Match Schedule</h2>
      <div className="schedule-grid">
        {schedule.map((match, index) => (
          <div key={index} className="match-card">
            <div className="match-header">
              <h3>{match.matchNumber}</h3>
              <p>{match.date} - {match.time}</p>
              <p className="venue">{match.venue}</p>
            </div>
            
            <div className="match-teams">
              <div className="team">
                <img src={match.homeTeamLogo} alt={match.homeTeam} />
                <p>{match.homeTeam}</p>
              </div>
              <span className="vs">VS</span>
              <div className="team">
                <img src={match.awayTeamLogo} alt={match.awayTeam} />
                <p>{match.awayTeam}</p>
              </div>
            </div>

            <div className="match-footer">
              <Link href={match.matchUrl} target="_blank" className="match-link">
                Match Centre
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;
