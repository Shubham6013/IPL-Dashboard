"use client";
import Link from "next/link";

interface UpcomingMatchProps {
  match: {
    matchNumber: string;
    date: string;
    time: string;
    venue: string;
    homeTeam: string;
    homeTeamLogo: string;
    awayTeam: string;
    awayTeamLogo: string;
    matchUrl: string;
  };
}

const UpcomingMatch: React.FC<UpcomingMatchProps> = ({ match }) => {
  return (
    <div 
      className="relative rounded-lg shadow-xl p-6 max-w-3xl mx-auto overflow-hidden"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/89699/pexels-photo-89699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-yellow-500 pb-2">Next IPL Match</h2>
        
        <div className="flex justify-between items-center">
          <div className="team flex flex-col items-center">
            <div className="bg-white rounded-full p-2 mb-2 shadow-lg">
              <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-16 h-16" />
            </div>
            <p className="text-lg font-semibold text-white">{match.homeTeam}</p>
          </div>
          
          <div className="vs-container flex flex-col items-center">
            <span className="text-2xl font-bold text-yellow-400 bg-black bg-opacity-50 px-3 py-1 rounded-full">VS</span>
            <div className="mt-2 bg-gray-800 bg-opacity-75 text-white px-4 py-2 rounded-lg">
              <p>{match.date}</p>
              <p className="font-bold">{match.time}</p>
            </div>
          </div>
          
          <div className="team flex flex-col items-center">
            <div className="bg-white rounded-full p-2 mb-2 shadow-lg">
              <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-16 h-16" />
            </div>
            <p className="text-lg font-semibold text-white">{match.awayTeam}</p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-200 mb-1">{match.venue}</p>
          <Link 
            href={match.matchUrl} 
            target="_blank" 
            className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
          >
            Match Centre
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatch;