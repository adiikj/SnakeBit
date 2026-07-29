'use client';

import { useEffect, useState } from 'react';

export default function MultiHome() {
  // roomCode and playerName are read client-only after mount to stay SSR-safe
  const [roomCode, setRoomCode] = useState('No Room Code Provided');
  const [playerName, setPlayerName] = useState('User');

  useEffect(() => {
    setRoomCode(sessionStorage.getItem('roomCode') || 'No Room Code Provided');
    setPlayerName(localStorage.getItem('playerName') || 'User');
  }, []);

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
