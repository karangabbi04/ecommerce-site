import jwt, {SignOptions} from "jsonwebtoken"; 
import { env } from "../config/env.js";
import { Role } from "../constants/admin.constants.js";


export type jwtPayload = {
  userId: string;
  email: string;
   role: string;
};


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
    } catch (err:any) {
        if(err.name === "TokenExpiredError"){
            throw new Error("Access token expired");
        }

        if(err.name === "JsonWebTokenError"){
            throw new Error("Invalid access token");
        }

        throw err;
    }
}

export function verifyRefreshToken(token: string): jwtPayload {
    try {
        return jwt.verify(token, env.jwtRefreshSecret) as jwtPayload;
    } catch (err:any) {
        if(err.name === "TokenExpiredError"){
            throw new Error("refresh token expired");
        }

        if(err.name === "JsonWebTokenError"){
            throw new Error("Invalid refresh token");
        }

        throw err;
    }
}