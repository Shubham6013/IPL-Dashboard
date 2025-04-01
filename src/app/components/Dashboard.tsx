"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import UpcomingMatch from "./UpcomingMatch/UpcomingMatch ";

const Dashboard = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/schedule");
        if (!response.ok) {
          throw new Error(`Failed to fetch schedule. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.schedule && data.schedule.length > 0) {
          setMatch(data.schedule[0]); 
        }
      } catch (error) {
        console.error("Error fetching match schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = [
    {
      title: "Points Table",
      href: "/points-table",
      bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTePT_l-qxZ3NRbbprz_IDWHXxyYEtekpFgA&s",
      description: "View the current standings of all teams",
      color: "from-blue-800/80 to-blue-900/90"
    },
    {
      title: "Match Schedule",
      href: "/match-schedule",
      bgImage: "https://i.pinimg.com/474x/0c/b8/6a/0cb86a6dccc260221287279f63a206ca.jpg",
      description: "Check upcoming and past matches",
      color: "from-purple-800/80 to-purple-900/90"
    },
    {
      title: "Teams",
      href: "/teams",
      bgImage: "https://i.pinimg.com/736x/5a/64/4b/5a644bd7163f2995a8a7937eb6d25ac3.jpg",
      description: "Learn about your favorite IPL teams",
      color: "from-red-800/80 to-red-900/90"
    },
    {
      title: "Venues",
      href: "/venues",
      bgImage: "https://t4.ftcdn.net/jpg/08/36/39/93/360_F_836399356_W83kTDajzSuqTKp1wQTIWK2KOGcah37l.jpg",
      description: "Explore stadiums hosting IPL matches",
      color: "from-green-800/80 to-green-900/90"
    }
  ];

  return (
    <div 
      className="min-h-screen w-full py-6 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('https://wallpapercave.com/wp/wp4793580.jpg')",
        backgroundColor: "#0a1929" // Fallback color
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">
          IPL Dashboard
        </h1>

        <div className="mb-8">
          {loading ? (
            <p className="text-center text-white">Loading upcoming match...</p>
          ) : match ? (
            <UpcomingMatch match={match} />
          ) : (
            <p className="text-center text-white">No upcoming match available</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block group relative overflow-hidden rounded-xl shadow-xl h-48 sm:h-64 transition-transform hover:scale-105"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url('${section.bgImage}')` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${section.color} z-10`}></div>
              <div className="absolute inset-0 z-20 p-4 flex flex-col justify-end">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-200 text-sm sm:text-base mb-2 opacity-80">
                  {section.description}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-sm text-yellow-300 group-hover:text-yellow-100">
                    View details
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <ImageCarousel />

      <footer className="mt-12 py-4 text-center">
        <div className="inline-block px-6 py-2 bg-black/50 rounded-full backdrop-blur-sm">
          <p className="text-white text-sm sm:text-base">
            <span className="text-yellow-300 font-light">Crafted by</span>{" "}
            <span className="font-semibold">Shubham Shrivastava</span>{" "}
            <span className="text-yellow-300 animate-pulse">❤</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
