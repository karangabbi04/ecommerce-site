import jwt, {SignOptions} from "jsonwebtoken"; 
import { env } from "../config/env";


export type jwtPayload = {
  userId: string;
  email: string;
};

const secret = process.env.JWT_ACCESS_SECRET as string;
const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN as string;

export function generateAccessToken(payload: jwtPayload):string {
    const options: SignOptions = {
        expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function generateRefreshToken(payload: jwtPayload):string {
    const options: SignOptions = {
        expiresIn: env.jwtRefreshExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.jwtRefreshSecret, options);
} 
export function verifyAccessToken(token: string): jwtPayload {
    try {
        return jwt.verify(token, env.jwtAccessSecret) as jwtPayload;
    } catch (err) {
        throw new Error("Invalid access token");
    }
}

export function verifyRefreshToken(token: string): jwtPayload {
    try {
        return jwt.verify(token, env.jwtRefreshSecret) as jwtPayload;
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
}