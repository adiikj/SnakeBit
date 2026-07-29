import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import snakeBlue from '../../assets/Graphics/blue.png';
import snakeRed from '../../assets/Graphics/red.png';
import snakePurple from '../../assets/Graphics/purple.png';
import snakeYellow from '../../assets/Graphics/yellow.png';
import snakeRandom from '../../assets/Graphics/random.png';
import rightArrow from '../../assets/Graphics/right-arrow.png';
import leftArrow from '../../assets/Graphics/left-arrow.png';
import boardSizeSmall from '../../assets/Graphics/board-small.png';
import boardSizeMedium from '../../assets/Graphics/board-medium.png';
import boardSizeLarge from '../../assets/Graphics/board-large.png';
import yes from '../../assets/Graphics/yes.png';
import no from '../../assets/Graphics/no.png';
import solidTexture from '../../assets/Graphics/solid.png';
import stripedTexture from '../../assets/Graphics/stripes.jpg';
import spottedTexture from '../../assets/Graphics/dots.jpg';
import easy from '../../assets/Graphics/easy.png';
import medium from '../../assets/Graphics/medium.png';
import hard from '../../assets/Graphics/hard.png';

function Config() {
  const [snakeColor, setSnakeColor] = useState('blue');
  const [boardSize, setBoardSize] = useState('medium');
  const [snakeTexture, setSnakeTexture] = useState('solid');
  const [difficulty, setDifficulty] = useState('medium');
  const [powerUp, setPowerUp] = useState(false);
  const navigate = useNavigate();

  const options = [
    {
      label: 'Snake Color',
      value: snakeColor,
      options: ['red', 'blue', 'yellow', 'purple', 'random'],
      set: setSnakeColor,
      preview: [snakeRed, snakeBlue, snakeYellow, snakePurple, snakeRandom],
    },
    {
      label: 'Board Size',
      value: boardSize,
      options: ['small', 'medium', 'large'],
      set: setBoardSize,
      preview: [boardSizeSmall, boardSizeMedium, boardSizeLarge],
    },
    {
      label: 'Snake Texture',
      value: snakeTexture,
      options: ['solid', 'striped', 'spotted'],
      set: setSnakeTexture,
      preview: [solidTexture, stripedTexture, spottedTexture],
    },
    {
      label: 'Difficulty',
      value: difficulty,
      options: ['easy', 'medium', 'hard'],
      set: setDifficulty,
      preview: [easy, medium, hard],
    },
    {
      label: 'Include Power-ups?',
      value: powerUp ? 'Yes' : 'No',
      options: ['Yes', 'No'],
      set: setPowerUp,
      preview: [yes, no],
    },
  ];

  const handleSelectionChange = (index, direction) => {
    const option = options[index];
    const currentIndex = option.options.indexOf(option.value);
    let newIndex;

    if (option.label === 'Include Power-ups?') {
      option.set(!powerUp); // Toggle state for power-ups
      return;
    }

    if (direction === 'left') {
      newIndex = currentIndex === 0 ? option.options.length - 1 : currentIndex - 1;
    } else if (direction === 'right') {
      newIndex = currentIndex === option.options.length - 1 ? 0 : currentIndex + 1;
    }

    option.set(option.options[newIndex]);
  };

  const handleStartGame = () => {
    navigate('/play', {
      state: { snakeColor, boardSize, snakeTexture, difficulty, powerUp },
    });
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
                  <img className="w-8 h-8 sm:w-10 sm:h-10" src={leftArrow} alt="Previous" />
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
                  <img className="w-8 h-8 sm:w-10 sm:h-10" src={rightArrow} alt="Next" />
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

export default Config;
