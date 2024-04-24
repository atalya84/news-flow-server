import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import bcrypt from 'bcrypt';

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
                user = await User.create({
                    'name': email.split("@")[0],
                    'email': email,
                    'password': '0',
                    'imgUrl': payload?.picture
                });
            }
            const tokens = await generateTokens(user)
            res.status(200).send({
                user,
                ...tokens
            })
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }

}

export const register = async (req: Request, res: Response) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const imgUrl = req.body?.imgUrl;
    const name = req.body?.name;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await User.findOne({ 'email': email });
    if (rs != null) {
        return res.status(406).send("email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const rs2 = await User.create({
        'email': email,
        'password': encryptedPassword,
        'imgUrl': imgUrl,
        'name': name
    });
    const tokens = await generateTokens(rs2)
    const added_user = await User.findOne({"email": email});
    res.status(201).send({
        user: added_user,
        ...tokens
    })
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_EXPIRATION });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_TOKEN);
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