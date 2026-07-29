import axios from 'axios';

// Set the base URL for the backend API
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(import.meta.env.VITE_API_BASE_URL);
console.log('API Base URL:', BASE_URL);

// Create an Axios instance for API requests
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to save player's name
export const savePlayerName = async (name) => {
  try {
    const response = await api.post('/savename', { name });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error saving player name.';
    console.error('Error saving name:', errorMessage);
    throw new Error(errorMessage); // Re-throw error for further handling in the calling component
  }
};

// Function to retrieve the latest player's name
export const getPlayerName = async (name) => {
  try {
    const response = await api.get(`/getname/${name}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error fetching player name.';
    console.error('Error fetching player name:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to update a player's high score
export const updateHighScore = async (name, score) => {
  try {
    const response = await api.post('/updatehighscore', { name, highScore: score });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error updating high score.';
    console.error('Error updating high score:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to retrieve the high score for a specific player
export const getHighScore = async (name) => {
  try {
    const response = await api.get(`/gethighscore/${name}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error fetching high score.';
    console.error('Error fetching high score:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getAllHighScores = async () => {
  try {
    const response = await api.get('/getallhighscores');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error fetching high scores.';
    console.error('Error fetching high scores:', errorMessage);
    throw new Error(errorMessage);
  }
}