import axios from 'axios';
import { HighScorePlayer } from '@/types/game';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
  success: boolean;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

// Save the player's name (prevent duplicates)
export const savePlayerName = async (name: string): Promise<ApiEnvelope<HighScorePlayer>> => {
  try {
    const response = await api.post<ApiEnvelope<HighScorePlayer>>('/savename', { name });
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Error saving player name.');
    console.error('Error saving name:', message);
    throw new Error(message);
  }
};

// Retrieve the latest player's name
export const getPlayerName = async (name: string): Promise<ApiEnvelope<{ name: string }>> => {
  try {
    const response = await api.get<ApiEnvelope<{ name: string }>>(`/getname/${name}`);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Error fetching player name.');
    console.error('Error fetching player name:', message);
    throw new Error(message);
  }
};

// Update a player's high score
export const updateHighScore = async (
  name: string,
  score: number
): Promise<ApiEnvelope<{ highScore: number }>> => {
  try {
    const response = await api.post<ApiEnvelope<{ highScore: number }>>('/updatehighscore', {
      name,
      highScore: score,
    });
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Error updating high score.');
    console.error('Error updating high score:', message);
    throw new Error(message);
  }
};

// Retrieve the high score for a specific player
export const getHighScore = async (name: string): Promise<ApiEnvelope<{ highScore: number }>> => {
  try {
    const response = await api.get<ApiEnvelope<{ highScore: number }>>(`/gethighscore/${name}`);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Error fetching high score.');
    console.error('Error fetching high score:', message);
    throw new Error(message);
  }
};

export const getAllHighScores = async (): Promise<ApiEnvelope<HighScorePlayer[]>> => {
  try {
    const response = await api.get<ApiEnvelope<HighScorePlayer[]>>('/getallhighscores');
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Error fetching high scores.');
    console.error('Error fetching high scores:', message);
    throw new Error(message);
  }
};
