'use client';

import { useEffect, useState } from 'react';
import Gameboard from '@/components/Gameboard';
import Leaderboard from '@/components/Leaderboard';
import MobileJoystick from '@/components/MobileJoystick';
import { getAllHighScores } from '@/lib/api';
import { GameConfig, HighScorePlayer } from '@/types/game';

const DEFAULT_CONFIG: GameConfig = {
  snakeColor: 'blue',
  boardSize: 'medium',
  snakeTexture: 'solid',
  difficulty: 'medium',
  powerUp: false,
};

export default function Play() {
  // Config chosen on the Config page, handed off via sessionStorage (Next.js navigation has no router state)
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [leaderboardData, setLeaderboardData] = useState<HighScorePlayer[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('gameConfig');
    if (stored) {
      setGameConfig(JSON.parse(stored));
    }
  }, []);

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await getAllHighScores();
        if (response?.data && Array.isArray(response.data)) {
          setLeaderboardData(response.data);
        } else {
          console.log('Invalid leaderboard data:', response);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error instanceof Error ? error.message : error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="flex w-full h-screen bg-green-700 font-arcade flex-col lg:flex-row">
      {/* Left side for the gameboard */}
      <div className="w-full lg:w-2/3 h-screen flex flex-col justify-start items-center px-4 lg:px-20">
        {/* Gameboard below the scoreboard */}
        <Gameboard gameConfig={gameConfig} />
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
