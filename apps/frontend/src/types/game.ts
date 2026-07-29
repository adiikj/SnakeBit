export interface GameConfig {
  snakeColor: string;
  boardSize: string;
  snakeTexture: string;
  difficulty: string;
  powerUp: boolean;
}

export interface HighScorePlayer {
  name: string;
  highScore: number;
}
