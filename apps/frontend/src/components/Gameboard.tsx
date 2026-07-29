'use client';

import { useEffect, useState, useRef } from 'react';
import { savePlayerName, getPlayerName, updateHighScore, getHighScore } from '@/lib/api';
import Scoreboard from './Scoreboard';
import { GameConfig } from '@/types/game';

interface Point {
  x: number;
  y: number;
}

interface GameboardProps {
  gameConfig: GameConfig;
}

export default function Gameboard({ gameConfig }: GameboardProps) {
  const { boardSize, difficulty } = gameConfig;

  const [snake, setSnake] = useState<Point[]>([{ x: 2, y: 2 }]);
  const [playerName, setPlayerName] = useState('');
  const [direction, setDirection] = useState<Point>({ x: 0, y: 0 });
  const [apple, setApple] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);

  const handleLogin = async (newPlayerName: string) => {
    const correctname = newPlayerName.toLowerCase();
    try {
      if (!correctname) {
        console.error('Player name is required');
        return;
      }

      const existingPlayer = await getPlayerName(correctname);

      if (existingPlayer?.data?.name === correctname) {
        setPlayerName(existingPlayer.data.name);
        localStorage.setItem('playerName', existingPlayer.data.name);
      } else {
        // Delete the player data from localStorage if not in DB
        localStorage.removeItem('playerName');
        localStorage.removeItem('highScore');

        await savePlayerName(correctname);
        setPlayerName(correctname);
        localStorage.setItem('playerName', correctname);
      }

      // Fetch high score from database
      const highScoreData = await getHighScore(correctname);

      // Handle case where there is no high score data (e.g., deleted or not available)
      const dbHighScore = highScoreData?.data?.highScore || 0;

      // Get stored high score from localStorage (if any)
      const storedHighScore = Number(localStorage.getItem('highScore')) || 0;

      // Calculate the final high score (prefer DB value over localStorage)
      const finalHighScore = Math.max(dbHighScore, storedHighScore);

      // Set the final high score in state and localStorage
      setHighScore(finalHighScore);
      localStorage.setItem('highScore', String(finalHighScore));
    } catch (error) {
      console.error('Error during login:', error instanceof Error ? error.message : error);
    }
  };

  // Track viewport width on the client only (SSR has no window)
  useEffect(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  // Automatically load the last logged-in player
  useEffect(() => {
    const storedPlayerName = localStorage.getItem('playerName');
    if (storedPlayerName) {
      handleLogin(storedPlayerName);
    } else {
      console.log('Player name not found in localStorage.');
    }
  }, []);

  // Update high score when score exceeds it
  useEffect(() => {
    if (playerName && score > highScore) {
      const updateHighScoreAsync = async () => {
        try {
          console.log(`Updating high score. Current Score: ${score}, High Score: ${highScore}`);
          setHighScore(score);
          localStorage.setItem('highScore', String(score));

          const response = await updateHighScore(playerName, score);
          console.log('High score updated successfully:', response);
        } catch (error) {
          console.error('Error updating high score:', error instanceof Error ? error.message : error);
        }
      };

      updateHighScoreAsync();
    }
  }, [score, highScore, playerName]);

  // Update directionRef and snakeRef
  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
  }, [direction, snake]);

  const gridSize = (() => {
    const width = viewportWidth ?? 1024;
    if (width < 768) {
      // For mobile screens
      return boardSize === 'small' ? 8 : boardSize === 'medium' ? 14 : 20;
    } else {
      return boardSize === 'small' ? 10 : boardSize === 'medium' ? 18 : 25;
    }
  })();

  // Place apple at a random position
  const placeApple = () => {
    let newApple: Point;
    do {
      newApple = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snakeRef.current.some((segment) => segment.x === newApple.x && segment.y === newApple.y));
    setApple(newApple); // Set new apple position
  };

  // Reset the game
  const resetGame = () => {
    setSnake([{ x: 2, y: 2 }]);
    setDirection({ x: 0, y: 0 });
    setApple({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
    setIsMoving(false);
  };

  // Game loop for snake movement
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(
      () => {
        if (!isMoving) return;

        setSnake((prevSnake) => {
          const newHead = {
            x: prevSnake[0].x + directionRef.current.x,
            y: prevSnake[0].y + directionRef.current.y,
          };

          // Check collisions
          if (
            newHead.x < 0 ||
            newHead.y < 0 ||
            newHead.x >= gridSize ||
            newHead.y >= gridSize ||
            prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
          ) {
            setGameOver(true);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check apple collision
          if (newHead.x === apple.x && newHead.y === apple.y) {
            setScore((prevScore) => prevScore + 1); // Increment score
            placeApple(); // Spawn a new apple
          } else {
            newSnake.pop(); // Remove tail if no apple eaten
          }

          return newSnake;
        });
      },
      difficulty === 'hard' ? 100 : difficulty === 'medium' ? 200 : 300
    );

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, isMoving, apple]); // Added apple to dependency array to ensure apple respawn is tracked

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMoving) setIsMoving(true);

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowDown':
        case 's':
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowRight':
        case 'd':
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoving]);

  // Render the snake body, head, tail, and turns
  const renderSnakeSegment = (segment: Point, index: number) => {
    // Head rendering (index 0)
    if (index === 0) {
      if (direction.y === 1) return <img src="/Graphics/head_right.png" alt="Snake Head" className="w-full h-full scale-125" />;
      if (direction.y === -1) return <img src="/Graphics/head_left.png" alt="Snake Head" className="w-full h-full scale-125" />;
      if (direction.x === 1) return <img src="/Graphics/head_down.png" alt="Snake Head" className="w-full h-full scale-125" />;
      if (direction.x === -1) return <img src="/Graphics/head_up.png" alt="Snake Head" className="w-full h-full scale-125" />;
    }

    // Tail rendering (last index)
    if (index === snake.length - 1) {
      const prevSegment = snake[snake.length - 2]; // The second-to-last segment

      if (prevSegment) {
        const prevDirection = {
          x: prevSegment.x - segment.x,
          y: prevSegment.y - segment.y,
        };

        // Tail should be opposite to the second-to-last segment's direction
        if (prevDirection.y === 1) {
          return <img src="/Graphics/tail_left.png" alt="Snake Tail 1" className="w-full h-full" />;
        }
        if (prevDirection.y === -1) {
          return <img src="/Graphics/tail_right.png" alt="Snake Tail 2" className="w-full h-full" />;
        }
        if (prevDirection.x === 1) {
          return <img src="/Graphics/tail_up.png" alt="Snake Tail 3" className="w-full h-full" />;
        }
        if (prevDirection.x === -1) {
          return <img src="/Graphics/tail_down.png" alt="Snake Tail 4" className="w-full h-full" />;
        }
      }
    }

    // Detect body segments (for non-head, non-tail segments)
    const prevSegment = snake[index - 1]; // The previous segment of the snake
    const nextSegment = snake[index + 1]; // The next segment of the snake

    if (prevSegment) {
      const prevDirection = {
        x: prevSegment.x - segment.x,
        y: prevSegment.y - segment.y,
      };

      const nextDirection = nextSegment ? { x: nextSegment.x - segment.x, y: nextSegment.y - segment.y } : null;

      // Handle vertical body (body going up/down)
      if (prevDirection.x === 0 && nextDirection?.x === 0) {
        if (prevDirection.y === 1 || prevDirection.y === -1) {
          return <img src="/Graphics/solid.png" alt="Snake Body Vertical" className="w-full h-full" />;
        }
      }

      // Handle horizontal body (body going left/right)
      if (prevDirection.y === 0 && nextDirection?.y === 0) {
        if (prevDirection.x === 1 || prevDirection.x === -1) {
          return <img src="/Graphics/solid.png" alt="Snake Body Horizontal" className="w-full h-full" />;
        }
      }

      // Handle turns based on previous and next direction
      if (prevDirection.x === 0 && nextDirection?.y === 0) {
        // Moving vertically and turning horizontally (up-right, up-left, down-right, down-left)
        if (prevDirection.y === -1 && nextDirection.x === 1) {
          return <img src="/Graphics/body_topright.png" alt="Up-Right Turn" className="w-full h-full" />;
        }
        if (prevDirection.y === -1 && nextDirection.x === -1) {
          return <img src="/Graphics/body_bottomright.png" alt="Up-Left Turn" className="w-full h-full" />;
        }
        if (prevDirection.y === 1 && nextDirection.x === 1) {
          return <img src="/Graphics/body_topleft.png" alt="Down-Right Turn" className="w-full h-full" />;
        }
        if (prevDirection.y === 1 && nextDirection.x === -1) {
          return <img src="/Graphics/body_bottomleft.png" alt="Down-Left Turn" className="w-full h-full" />;
        }
      }

      // Handle horizontal turn (moving horizontally and turning vertically)
      if (prevDirection.y === 0 && nextDirection?.x === 0) {
        // Moving horizontally and turning vertically (right-up, right-down, left-up, left-down)
        if (prevDirection.x === 1 && nextDirection.y === 1) {
          return <img src="/Graphics/body_topleft.png" alt="Right-Down Turn" className="w-full h-full" />;
        }
        if (prevDirection.x === 1 && nextDirection.y === -1) {
          return <img src="/Graphics/body_topright.png" alt="Right-Up Turn" className="w-full h-full" />;
        }
        if (prevDirection.x === -1 && nextDirection.y === 1) {
          return <img src="/Graphics/body_bottomleft.png" alt="Left-Down Turn" className="w-full h-full" />;
        }
        if (prevDirection.x === -1 && nextDirection.y === -1) {
          return <img src="/Graphics/body_bottomright.png" alt="Left-Up Turn" className="w-full h-full" />;
        }
      }
    }

    // Default body rendering (if no turn is detected)
    return <img src="/Graphics/solid.png" alt="Snake Body" className="w-full h-full" />;
  };

  // Adjust cell size based on selected gameboard size and screen size
  const cellSize = (() => {
    const width = viewportWidth ?? 1024;
    if (width < 768) {
      // For mobile screens
      return boardSize === 'small' ? 'w-8 h-8' : boardSize === 'medium' ? 'w-6 h-6' : 'w-4 h-4';
    } else {
      // For desktop/tablet screens
      return boardSize === 'small' ? 'w-10 h-10' : boardSize === 'medium' ? 'w-8 h-8' : 'w-6 h-6';
    }
  })();

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        const isSnake = snake.some((segment) => segment.x === i && segment.y === j);
        const isApple = apple.x === i && apple.y === j;
        const cellColor = (i + j) % 2 === 0 ? 'bg-green-600' : 'bg-green-800';

        row.push(
          <div key={`${i}-${j}`} className={`${cellSize} ${cellColor} flex items-center justify-center`}>
            {isSnake
              ? renderSnakeSegment(
                  snake.find((segment) => segment.x === i && segment.y === j)!,
                  snake.findIndex((segment) => segment.x === i && segment.y === j)
                )
              : isApple
                ? <img src="/Graphics/apple.png" alt="Apple" className="w-full h-full scale-125" />
                : null}
          </div>
        );
      }
      grid.push(
        <div key={i} className="flex">
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-green-700 p-4 sm:p-8 md:p-12 lg:p-16">
      {gameOver && (
        <div className="absolute w-64 sm:w-2/3 md:w-1/2 lg:w-1/3 h-28 md:h-36 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 rounded-lg">
          <h1 className="text-2xl font-semibold text-white mb-4">Game Over!</h1>
          <button
            onClick={resetGame}
            className="bg-red-500 text-white px-2 py-2 md:px-4 md:py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      <Scoreboard score={score} highscore={highScore} />

      {/* Grid for the game */}
      <div className="flex flex-col border-8 border-green-700">{renderGrid()}</div>
    </div>
  );
}
