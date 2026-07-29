import React from 'react';

function Leaderboard({ leaderboardData }) {
  // Ensure leaderboardData is always an array
  const validLeaderboardData = Array.isArray(leaderboardData) ? leaderboardData : [];

  if (validLeaderboardData.length === 0) {
    return (
      <div className="w-full h-auto rounded-lg bg-green-600 mt-20 font-arcade text-center flex flex-col justify-center items-center px-4 sm:px-8">
        <h1 className="rounded-lg bg-green-500 w-full text-3xl sm:text-4xl py-3 text-white tracking-wider mb-8">🏆 Global Leaderboard 🏆</h1>
        <p className="text-white text-lg sm:text-xl">No leaderboard data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto rounded-lg bg-green-600 mt-0 md:mt-20 font-arcade text-center flex flex-col justify-center items-center">
      <h1 className="rounded-lg bg-green-500 w-full text-2xl sm:text-3xl py-3 text-white tracking-wider mb-5">🏆 Global Leaderboard 🏆</h1>
      <div className="text-white">
        <ul className="list-none">
          {validLeaderboardData.map((player, index) => {
            let medal = '';
            if (index === 0) {
              medal = '🥇';  // 1st place: Gold medal
            } else if (index === 1) {
              medal = '🥈';  // 2nd place: Silver medal
            } else if (index === 2) {
              medal = '🥉';  // 3rd place: Bronze medal
            }

            return (
              <li key={index} className="text-xl sm:text-2xl mb-3">
                <div className="[word-spacing:10px]">
                  {medal && <span className="mr-2">{medal}</span>}
                  {player.name} : {player.highScore}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
