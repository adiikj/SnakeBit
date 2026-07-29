import React, { useEffect, useState, useRef } from "react";
import { savePlayerName, getPlayerName, updateHighScore, getHighScore } from "../../api/api"; // Assuming API functions are imported
import Scoreboard from "./Scoreboard";
import appleImg from "../../assets/Graphics/apple.png";
import snakeHeadUp from "../../assets/Graphics/head_up.png"; // Add image for head up
import snakeHeadDown from "../../assets/Graphics/head_down.png"; // Add image for head down
import snakeHeadLeft from "../../assets/Graphics/head_left.png"; // Add image for head left
import snakeHeadRight from "../../assets/Graphics/head_right.png"; // Add image for head right
import snakeBodyImg from "../../assets/Graphics/solid.png"; // Body image
import snakeBodyVertical from "../../assets/Graphics/solid.png"; // Vertical body image
import snakeTailUp from "../../assets/Graphics/tail_up.png"; // Add image for tail up
import snakeTailDown from "../../assets/Graphics/tail_down.png"; // Add image for tail down
import snakeTailLeft from "../../assets/Graphics/tail_left.png"; // Add image for tail left
import snakeTailRight from "../../assets/Graphics/tail_right.png"; // Add image for tail right
import snakeTurnUpRight from "../../assets/Graphics/body_topright.png"; // Add image for turn up-right
import snakeTurnUpLeft from "../../assets/Graphics/body_topleft.png"; // Add image for turn up-left
import snakeTurnDownRight from "../../assets/Graphics/body_bottomright.png"; // Add image for turn down-right
import snakeTurnDownLeft from "../../assets/Graphics/body_bottomleft.png"; // Add image for turn down-left

function Gameboard({ gameConfig }) {
  const { boardSize, difficulty } = gameConfig;

  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [playerName, setPlayerName] = useState("");
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [apple, setApple] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const handleLogin = async (newPlayerName) => {
    const correctname = newPlayerName.toLowerCase();
    try {
      if (!correctname) {
        console.error("Player name is required");
        return;
      }
      
      const existingPlayer = await getPlayerName(correctname);
  
      if (existingPlayer && existingPlayer.name === correctname) {
        setPlayerName(existingPlayer.name);
        localStorage.setItem("playerName", existingPlayer.name);
      } else {
        // Delete the player data from localStorage if not in DB
        localStorage.removeItem("playerName");
        localStorage.removeItem("highScore");
  
        await savePlayerName(correctname);
        setPlayerName(correctname);
        localStorage.setItem("playerName", correctname);
      }
  
      // Fetch high score from database
      const highScoreData = await getHighScore(correctname);
  
      // Handle case where there is no high score data (e.g., deleted or not available)
      const dbHighScore = highScoreData?.data?.highScore || 0;
  
      // Get stored high score from localStorage (if any)
      const storedHighScore = Number(localStorage.getItem("highScore")) || 0;
  
      // Calculate the final high score (prefer DB value over localStorage)
      const finalHighScore = Math.max(dbHighScore, storedHighScore);
  
      // Set the final high score in state and localStorage
      setHighScore(finalHighScore);
      localStorage.setItem("highScore", finalHighScore);
  
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };  

  // Automatically load the last logged-in player
  useEffect(() => {
    const storedPlayerName = localStorage.getItem("playerName");
    if (storedPlayerName) {
      handleLogin(storedPlayerName);
    } else {
      console.log("Player name not found in localStorage.");
    }
  }, []);

  // Update high score when score exceeds it
  useEffect(() => {
    if (playerName && score > highScore) {
      const updateHighScoreAsync = async () => {
        try {
          console.log(`Updating high score. Current Score: ${score}, High Score: ${highScore}`);
          setHighScore(score);
          localStorage.setItem("highScore", score);

          const response = await updateHighScore(playerName, score);
          console.log("High score updated successfully:", response);
        } catch (error) {
          console.error("Error updating high score:", error.message);
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

  // Place apple at a random position
  const placeApple = () => {
    let newApple;
    do {
      newApple = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snakeRef.current.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    setApple(newApple);  // Set new apple position
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

    const interval = setInterval(() => {
      if (!isMoving) return;

      setSnake(prevSnake => {
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
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check apple collision
        if (newHead.x === apple.x && newHead.y === apple.y) {
          setScore(prevScore => prevScore + 1);  // Increment score
          placeApple();  // Spawn a new apple
        } else {
          newSnake.pop(); // Remove tail if no apple eaten
        }

        return newSnake;
      });
    }, difficulty === "hard" ? 100 : difficulty === "medium" ? 200 : 300);

    return () => clearInterval(interval);
  }, [gameOver, isMoving, apple]);  // Added apple to dependency array to ensure apple respawn is tracked

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMoving) setIsMoving(true);

      const { x, y } = directionRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowDown":
        case "s":
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
        case "ArrowLeft":
        case "a":
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowRight":
        case "d":
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoving]);

// Function to render the snake body, head, tail, and turns
const renderSnakeSegment = (segment, index) => {
  const { x, y } = segment;

  // Head rendering (index 0)
  if (index === 0) {
    if (direction.y === 1) return <img src={snakeHeadRight} alt="Snake Head" className="w-full h-full scale-125" />;
    if (direction.y === -1) return <img src={snakeHeadLeft} alt="Snake Head" className="w-full h-full scale-125" />;
    if (direction.x === 1) return <img src={snakeHeadDown} alt="Snake Head" className="w-full h-full scale-125" />;
    if (direction.x === -1) return <img src={snakeHeadUp} alt="Snake Head" className="w-full h-full scale-125" />;
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
        return <img src={snakeTailLeft} alt="Snake Tail 1" className="w-full h-full" />;
      }
      if (prevDirection.y === -1) {
        return <img src={snakeTailRight} alt="Snake Tail 2" className="w-full h-full" />;
      }
      if (prevDirection.x === 1) {
        return <img src={snakeTailUp} alt="Snake Tail 3" className="w-full h-full" />;
      }
      if (prevDirection.x === -1) {
        return <img src={snakeTailDown} alt="Snake Tail 4" className="w-full h-full" />;
      }
    }
  }

  // Detect body segments (for non-head, non-tail segments)
  const prevSegment = snake[index - 1];  // The previous segment of the snake
  const nextSegment = snake[index + 1];  // The next segment of the snake

  if (prevSegment) {
    const prevDirection = {
      x: prevSegment.x - segment.x,
      y: prevSegment.y - segment.y,
    };

    const nextDirection = nextSegment
      ? { x: nextSegment.x - segment.x, y: nextSegment.y - segment.y }
      : null;

    // Handle vertical body (body going up/down)
    if (prevDirection.x === 0 && nextDirection?.x === 0) {
      // Body is vertical (either going up or down)
      if (prevDirection.y === 1) {
        return <img src={snakeBodyImg} alt="Snake Body Vertical" className="w-full h-full" />;
      }
      if (prevDirection.y === -1) {
        return <img src={snakeBodyImg} alt="Snake Body Vertical" className="w-full h-full" />;
      }
    }

    // Handle horizontal body (body going left/right)
    if (prevDirection.y === 0 && nextDirection?.y === 0) {
      // Body is horizontal (either going left or right)
      if (prevDirection.x === 1) {
        return <img src={snakeBodyVertical} alt="Snake Body Horizontal" className="w-full h-full" />;
      }
      if (prevDirection.x === -1) {
        return <img src={snakeBodyVertical} alt="Snake Body Horizontal" className="w-full h-full" />;
      }
    }

    // Handle turns based on previous and next direction
    if (prevDirection.x === 0 && nextDirection?.y === 0) {
      // Moving vertically and turning horizontally (up-right, up-left, down-right, down-left)
      if (prevDirection.y === -1 && nextDirection.x === 1) {
        return <img src={snakeTurnUpRight} alt="Up-Right Turn" className="w-full h-full" />;
      }
      if (prevDirection.y === -1 && nextDirection.x === -1) {
        return <img src={snakeTurnDownRight} alt="Up-Left Turn" className="w-full h-full" />;
      }
      if (prevDirection.y === 1 && nextDirection.x === 1) {
        return <img src={snakeTurnUpLeft} alt="Down-Right Turn" className="w-full h-full" />;
      }
      if (prevDirection.y === 1 && nextDirection.x === -1) {
        return <img src={snakeTurnDownLeft} alt="Down-Left Turn" className="w-full h-full" />;
      }
    }

    // Handle horizontal turn (moving horizontally and turning vertically)
    if (prevDirection.y === 0 && nextDirection?.x === 0) {
      // Moving horizontally and turning vertically (right-up, right-down, left-up, left-down)
      if (prevDirection.x === 1 && nextDirection.y === 1) {
        return <img src={snakeTurnUpLeft} alt="Right-Down Turn" className="w-full h-full" />;
      }
      if (prevDirection.x === 1 && nextDirection.y === -1) {
        return <img src={snakeTurnUpRight} alt="Right-Up Turn" className="w-full h-full" />;
      }
      if (prevDirection.x === -1 && nextDirection.y === 1) {
        return <img src={snakeTurnDownLeft} alt="Left-Down Turn" className="w-full h-full" />;
      }
      if (prevDirection.x === -1 && nextDirection.y === -1) {
        return <img src={snakeTurnDownRight} alt="Left-Up Turn" className="w-full h-full" />;
      }
    }
  }

  // Default body rendering (if no turn is detected)
  return <img src={snakeBodyImg} alt="Snake Body" className="w-full h-full" />;
};

const gridSize = (()=>{
if (window.innerWidth < 768) { // For mobile screens
  return boardSize === "small" ? 8 :
         boardSize === "medium" ? 14 :
         20;  // 10x10 for small, 18x18 for medium, 25x25 for large
}else{
  return boardSize === "small" ? 10 :
         boardSize === "medium" ? 18 :
         25;  // 10x10 for small, 18x18 for medium, 25x25 for large
}
})();

// Adjust cell size based on selected gameboard size and screen size
const cellSize = (() => {
if (window.innerWidth < 768) { // For mobile screens
  return boardSize === "small" ? "w-8 h-8" :
         boardSize === "medium" ? "w-6 h-6" :
         "w-4 h-4";  // Small for mobile 10x10, Medium for mobile 18x18, Large for mobile 25x25
} else { // For desktop/tablet screens
  return boardSize === "small" ? "w-10 h-10" :
         boardSize === "medium" ? "w-8 h-8" :
         "w-6 h-6";  // Small for desktop 10x10, Medium for desktop 18x18, Large for desktop 25x25
}
})();

const renderGrid = () => {
const grid = [];
for (let i = 0; i < gridSize; i++) {
  const row = [];
  for (let j = 0; j < gridSize; j++) {
    const isSnake = snake.some(segment => segment.x === i && segment.y === j);
    const isApple = apple.x === i && apple.y === j;
    const cellColor = (i + j) % 2 === 0 ? "bg-green-600" : "bg-green-800";

    row.push(
      <div
        key={`${i}-${j}`}
        className={`${cellSize} ${cellColor} flex items-center justify-center`}
      >
        {isSnake
          ? renderSnakeSegment(
              snake.find(segment => segment.x === i && segment.y === j),
              snake.findIndex(segment => segment.x === i && segment.y === j)
            )
          : isApple ? (
              <img src={appleImg} alt="Apple" className="w-full h-full scale-125" />
            ) : null}
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
      <div className="flex flex-col border-8 border-green-700">
        {renderGrid()}
      </div>
    </div>
  );
}

export default Gameboard;
