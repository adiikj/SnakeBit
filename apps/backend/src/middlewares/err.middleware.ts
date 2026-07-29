import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};

export default errorMiddleware;
