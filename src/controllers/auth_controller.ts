import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

const client = new OAuth2Client();

export const googleSignin = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (email != null) {
            let user = await User.findOne({ 'email': email });
            if (user == null) {
                user = await User.create(
                    {
                        'name': email,
                        'email': email,
                        'password': '0',
                        'imgUrl': payload?.picture
                    });
            }
            const tokens = await generateTokens(user)
            res.status(200).send(
                {
                    user,
                    ...tokens
                })
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }

}

const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken
    };
}