import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface TokenPayload {
    id: string;
}

export const signAccessToken = (id: Types.ObjectId): string => {
    const payload: TokenPayload = { id: id.toString() };
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
    
    const options: SignOptions = {
        expiresIn
    };

    return jwt.sign(payload, secret, options);
};

export const signRefreshToken = (id: Types.ObjectId): string => {
    const payload: TokenPayload = { id: id.toString() };
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];

    const options: SignOptions = {
        expiresIn
    };

    return jwt.sign(payload, secret, options);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as TokenPayload;
};