import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
  },
  highScore: { 
    type: Number, 
    default: 0 
  }, // High score field
});

const Player = mongoose.model('Player', playerSchema);
export default Player;
