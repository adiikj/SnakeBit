'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameConfig } from '@/types/game';

interface ConfigOption {
  label: string;
  value: string;
  options: string[];
  set: (value: string | boolean) => void;
  preview: string[];
}

export default function Config() {
  const [snakeColor, setSnakeColor] = useState('blue');
  const [boardSize, setBoardSize] = useState('medium');
  const [snakeTexture, setSnakeTexture] = useState('solid');
  const [difficulty, setDifficulty] = useState('medium');
  const [powerUp, setPowerUp] = useState(false);
  const router = useRouter();

  const options: ConfigOption[] = [
    {
      label: 'Snake Color',
      value: snakeColor,
      options: ['red', 'blue', 'yellow', 'purple', 'random'],
      set: (value) => setSnakeColor(value as string),
      preview: [
        '/Graphics/red.png',
        '/Graphics/blue.png',
        '/Graphics/yellow.png',
        '/Graphics/purple.png',
        '/Graphics/random.png',
      ],
    },
    {
      label: 'Board Size',
      value: boardSize,
      options: ['small', 'medium', 'large'],
      set: (value) => setBoardSize(value as string),
      preview: ['/Graphics/board-small.png', '/Graphics/board-medium.png', '/Graphics/board-large.png'],
    },
    {
      label: 'Snake Texture',
      value: snakeTexture,
      options: ['solid', 'striped', 'spotted'],
      set: (value) => setSnakeTexture(value as string),
      preview: ['/Graphics/solid.png', '/Graphics/stripes.jpg', '/Graphics/dots.jpg'],
    },
    {
      label: 'Difficulty',
      value: difficulty,
      options: ['easy', 'medium', 'hard'],
      set: (value) => setDifficulty(value as string),
      preview: ['/Graphics/easy.png', '/Graphics/medium.png', '/Graphics/hard.png'],
    },
    {
      label: 'Include Power-ups?',
      value: powerUp ? 'Yes' : 'No',
      options: ['Yes', 'No'],
      set: (value) => setPowerUp(value as boolean),
      preview: ['/Graphics/yes.png', '/Graphics/no.png'],
    },
  ];

  const handleSelectionChange = (index: number, direction: 'left' | 'right') => {
    const option = options[index];
    const currentIndex = option.options.indexOf(option.value);
    let newIndex: number;

    if (option.label === 'Include Power-ups?') {
      option.set(!powerUp); // Toggle state for power-ups
      return;
    }

    if (direction === 'left') {
      newIndex = currentIndex === 0 ? option.options.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === option.options.length - 1 ? 0 : currentIndex + 1;
    }

    option.set(option.options[newIndex]);
  };

  const handleStartGame = () => {
    const gameConfig: GameConfig = { snakeColor, boardSize, snakeTexture, difficulty, powerUp };
    sessionStorage.setItem('gameConfig', JSON.stringify(gameConfig));
    router.push('/singleplayer/play');
  };

  return (
    <div className="w-full h-screen bg-green-600 font-arcade text-center flex flex-col justify-center items-center">
      <div className="container mx-auto py-4 text-white">
        <h1 className="mt-4 md:mt-0 text-3xl sm:text-5xl md:text-6xl [word-spacing:15px] md:[word-spacing:25px] tracking-wider font-bold">
          Customize Your Game
        </h1>

        <div className="mt-3 md:mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mx-4 sm:mx-10 md:mx-16 tracking-wider">
          {options.map((option, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Title */}
              <span className="text-lg sm:text-xl md:text-2xl tracking-wider font-semibold mb-4">
                {option.label}
              </span>

              {/* Image and Arrows */}
              <div className="flex items-center space-x-4">
                {/* Left Arrow */}
                <button
                  onClick={() => handleSelectionChange(index, 'left')}
                  className="text-white px-0 py-0 sm:px-4 sm:py-3"
                >
                  <img className="w-8 h-8 sm:w-10 sm:h-10" src="/Graphics/left-arrow.png" alt="Previous" />
                </button>

                {/* Image */}
                <img
                  src={option.preview[option.options.indexOf(option.value)] || option.preview[0]}
                  alt={option.label}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover"
                />

                {/* Right Arrow */}
                <button
                  onClick={() => handleSelectionChange(index, 'right')}
                  className="px-0 py-0 sm:px-4 sm:py-3"
                >
                  <img className="w-8 h-8 sm:w-10 sm:h-10" src="/Graphics/right-arrow.png" alt="Next" />
                </button>
              </div>

              {/* Value below the image */}
              <div className="mt-4 text-md sm:text-lg md:text-xl">{option.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 md:mt-8">
          <button
            onClick={handleStartGame}
            className="bg-green-700 text-white px-3 py-1 md:px-5 md:py-2 text-xl sm:text-2xl rounded-md ml-4 tracking-wider"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
