'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Choice() {
  // Retrieve the player's name from localStorage (client-only, read after mount to stay SSR-safe)
  const [playerName, setPlayerName] = useState('User');

  useEffect(() => {
    setPlayerName(localStorage.getItem('playerName') || 'User');
  }, []);

  return (
    <div className="bg-green-600 w-full h-screen font-arcade tracking-wider font-bold">
      <div className="flex justify-center items-center h-full px-4 sm:px-8 md:px-16">
        <div className="text-center">
          <span className="text-white text-4xl sm:text-5xl md:text-8xl tracking-wider">
            Welcome {playerName}!
          </span>
          <h1 className="text-white text-2xl sm:text-4xl md:text-6xl tracking-wider mt-6 mb-6">
            Choose Your Mode
          </h1>
          <div className="flex flex-col sm:flex-row sm:space-x-16 justify-center space-y-8 sm:space-y-0">
            {/* Single Player Mode */}
            <Link href="/singleplayer/config" className="relative group w-64 sm:w-72 md:w-80">
              <div className="relative overflow-hidden rounded-lg transform transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/single.jpg"
                  alt="Single Player Mode"
                  className="w-2/3 h-40 ml-16 md:ml-0 md:w-full md:h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-lg sm:text-xl md:text-2xl font-normal [word-spacing:10px]">
                    Single Player
                  </span>
                </div>
              </div>
            </Link>
            {/* Multiplayer Mode */}
            <Link href="/multiplayer/joinroom" className="relative group w-64 sm:w-72 md:w-80">
              <div className="relative overflow-hidden rounded-lg transform transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/multi.jpg"
                  alt="Multiplayer Mode"
                  className="w-2/3 h-40 ml-16 md:ml-0 md:w-full md:h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-lg sm:text-xl md:text-2xl font-normal [word-spacing:10px]">
                    Multiplayer
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
