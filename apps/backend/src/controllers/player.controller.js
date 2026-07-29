import Player from '../models/player.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Save the player's name (prevent duplicates)
export const savePlayerName = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json(new ApiResponse(400, 'Name is required!'));
  }

  // Check if player already exists
  const existingPlayer = await Player.findOne({ name });

  if (existingPlayer) {
    // If the player exists, allow them to log in using their existing data
    return res.status(200).json(
      new ApiResponse(200, 'Player found, logged in successfully!', {
        name: existingPlayer.name,
        highScore: existingPlayer.highScore,
      })
    );
  }

  // If the player does not exist, create a new one
  const player = new Player({ name, highScore: 0 });
  await player.save();

  res.status(201).json(
    new ApiResponse(201, 'New player created successfully!', {
      name: player.name,
      highScore: player.highScore,
    })
  );
});

// Get the player's name
export const getPlayerName = asyncHandler(async (req, res) => {
  const { name } = req.params; // Get the player name from the route parameter

  const player = await Player.findOne({ name }); // Fetch the player by their name
  if (!player) {
    return res.status(404).json(new ApiResponse(404, 'Player not found!')); // Return 404 if player doesn't exist
  }

  res.status(200).json(new ApiResponse(200, 'Player retrieved successfully!', { name: player.name })); // Return player data
});

// Update high score for a player
export const updateHighScore = asyncHandler(async (req, res) => {
  const { name, highScore } = req.body;

  if (!name || highScore === undefined) {
    return res.status(400).json(new ApiResponse(400, 'Name and highScore are required!'));
  }

  const player = await Player.findOne({ name });
  if (!player) {
    return res.status(404).json(new ApiResponse(404, 'Player not found!'));
  }

  if (highScore > player.highScore) {
    player.highScore = highScore;
    await player.save();
    return res
      .status(200)
      .json(new ApiResponse(200, 'High score updated successfully!', { highScore: player.highScore }));
  }

  res.status(200).json(new ApiResponse(200, 'No update needed; high score remains unchanged.', { highScore: player.highScore }));
});

// Get the high score for a player
export const getHighScore = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json(new ApiResponse(400, 'Name is required!'));
  }

  const player = await Player.findOne({ name });
  if (!player) {
    return res.status(404).json(new ApiResponse(404, 'Player not found!'));
  }

  res.status(200).json(new ApiResponse(200, 'High score retrieved successfully!', { highScore: player.highScore }));
});

//get all players high score
export const getAllHighScores = asyncHandler(async (req, res) => {
  const players = await Player.find({ highScore: { $gt: 0 } }).sort({ highScore: -1 }).limit(10);

  if (!players) {
    return res.status(404).json(new ApiResponse(404, 'No players found!'));
  }

  res.status(200).json(new ApiResponse(200, 'High scores retrieved successfully!', players));
});
