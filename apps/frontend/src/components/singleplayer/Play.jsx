import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Gameboard from './Gameboard.jsx';
import Leaderboard from './Leaderboard.jsx';
import Scoreboard from './Scoreboard.jsx';
import { getAllHighScores } from '../../api/api.js';
import MobileJoystick from '../MobileJoystick.jsx';

function Play() {
  const location = useLocation();
  
  // Access game config passed via state from Config.jsx
  const { snakeColor, boardSize, snakeTexture, difficulty, powerUp } = location.state || {};

  const [leaderboardData, setLeaderboardData] = React.useState([]);

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await getAllHighScores();
        if (response?.data && Array.isArray(response.data)) {
          setLeaderboardData(response.data);
        } else {
          console.log("Invalid leaderboard data:", response);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error.message);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="flex w-full h-screen bg-green-700 font-arcade flex-col lg:flex-row">
      {/* Left side for the gameboard */}
      <div className="w-full lg:w-2/3 h-screen flex flex-col justify-start items-center px-4 lg:px-20">
        {/* Scoreboard at the top */}
        {/* <Scoreboard /> */}
        
        {/* Gameboard below the scoreboard */}
        <Gameboard 
          gameConfig={{
            snakeColor,
            boardSize,
            snakeTexture,
            difficulty,
            powerUp
          }} 
        />
      </div>
      <div className="lg:hidden bg-green-700 w-auto h-auto">
        <MobileJoystick />
      </div>

      {/* Right side for the leaderboard */}
      <div className="w-full lg:w-1/3 h-screen p-4 bg-green-700 lg:mr-20 mt-0 md:mt-4 lg:mt-0">
        <Leaderboard leaderboardData={leaderboardData} />
      </div>
    </div>
  );
}

export default Play;
