import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { savePlayerName } from '../api/api'; // Assuming savePlayerName is your API function

function Home() {
  const [name, setName] = useState(''); // State to store user input
  const [error, setError] = useState(false); // State to manage validation error
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleStartGame = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(true); // Show error if name is empty
    } else {
      setError(false); // Clear the error message if name is valid
      try {
        // Call the API to save the player's name
        const correctname = name.toLowerCase();
        await savePlayerName(correctname);
        
        // Store the name in localStorage for use in other components
        localStorage.setItem('playerName', correctname);
        
        // Redirect to /choice after saving the name
        navigate('/choice');
      } catch (error) {
        console.error('Error saving player name', error);
        setError(true); // Show error if there is a problem with the API
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-green-600 font-arcade text-center flex justify-center items-center px-4 sm:px-8 md:px-16">
        <div className="container mx-auto py-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl [word-spacing:10px] md:[word-spacing:25px] tracking-wider text-white font-bold">
            Welcome to SnakeBit!
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl [word-spacing:10px] text-white tracking-wider">
            An Interactive Snake Game
          </p>
          <div className="mt-8 sm:mt-10 md:mt-12">
            <input
              type="text"
              className="rounded-md p-2 px-5 tracking-wider text-xl sm:text-2xl md:text-3xl"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name on input change
            />
            <button
              onClick={handleStartGame} // Use onClick to trigger validation and navigation
              className="bg-green-700 text-white px-4 py-1 md:px-5 md:py-2 text-xl sm:text-2xl md:text-3xl rounded-md ml-4 tracking-wider mt-4 sm:mt-6 md:mt-8"
            >
              Start Game
            </button>
            {error && (
              <p className="text-red-700 mt-2 text-lg sm:text-xl md:text-2xl tracking-wider">
                Please enter your name to proceed.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
