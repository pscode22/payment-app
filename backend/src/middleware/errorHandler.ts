import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);
  
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
    return;
  }
  
  if (error.name === 'MongoError' || error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }
  
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
    return;
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
