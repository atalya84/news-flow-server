import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import bcrypt from "bcrypt";

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

const generateTokens = async (user: Document<unknown, object, IUser> & IUser & Required<{
    _id: string;
}>): Promise<{ "accessToken": string, "refreshToken": string }> => {
    const accessToken = jwt.sign({ "_id": user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jwt.sign({ "_id": user._id, "random": random }, process.env.TOKEN_SECRET, {});
    if (user.refreshTokens == null) {
        user.refreshTokens = [];
    }
    user.refreshTokens.push(refreshToken);
    try {
        await user.save();
        return {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        };
    } catch (err) {
        return null;
    }
}

export const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const imgUrl = req.body.imgUrl
    if (email === undefined || password === undefined) {
        return res.status(400).send("Email and password are required");
    }
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ email: email, password: hashedPassword, name: name, imgUrl: imgUrl });
        return res.send(newUser);
    } catch (err) {
        return res.status(400).send(err.message);
    }
}