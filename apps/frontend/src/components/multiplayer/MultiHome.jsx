import React from 'react';
import { useLocation } from 'react-router-dom';

function MultiHome() {
  const location = useLocation();
  const roomCode = location.state?.roomCode || 'No Room Code Provided';
  const playerName = localStorage.getItem('playerName') || 'User';

  return (
    <div className="w-full h-screen bg-blue-600 flex items-center justify-center font-arcade">
      <div className="bg-blue-500 rounded-lg shadow-lg p-6 h-96 [width:500px]">
        <h1 className="text-5xl text-white tracking-wider mb-4 text-center">Welcome to the Room {playerName} </h1>
        <p className="text-3xl text-white text-center">
          Room Code: <span className="tracking-wider">{roomCode}</span>
        </p>
      </div>
    </div>
  );
}

export default MultiHome;
