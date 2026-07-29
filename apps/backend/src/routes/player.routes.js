import express from 'express';
import { savePlayerName, getPlayerName, getHighScore, updateHighScore, getAllHighScores } from '../controllers/player.controller.js';

const router = express.Router();

router.post('/savename', savePlayerName);
router.get('/getname/:name', getPlayerName);
router.get('/gethighscore/:name', getHighScore);
router.post('/updatehighscore', updateHighScore);
router.get('/getallhighscores', getAllHighScores);



export default router;
