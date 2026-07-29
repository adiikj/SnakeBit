import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  highScore: number;
}

const playerSchema = new Schema<IPlayer>({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
  },
  highScore: {
    type: Number,
    default: 0,
  },
});

const Player: Model<IPlayer> = mongoose.model<IPlayer>('Player', playerSchema);
export default Player;
