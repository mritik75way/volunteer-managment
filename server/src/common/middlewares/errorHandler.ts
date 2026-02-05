import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    if (err instanceof ZodError) {
        error.message = 'Validation Error';
        error.statusCode = 400;
        error.errors = err.issues;
    }

    if (err.name === 'CastError') {
        error.message = `Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400;
    }

    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        errors: error.errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorHandler;