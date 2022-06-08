import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';
import { calculateToken } from '../helpers/usersHelper';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as IUser;
        const user = await User.getUserByEmail(email);
        if (!user) {
            throw new ErrorHandler(401, 'This user does not exist');
        } else {
            const passwordIsCorrect : boolean = await User.verifyPassword(password, user.password);
            if (passwordIsCorrect) {
                const token = calculateToken(email, Number(user.id));
                res.cookie('user_token', token);
                res.status(200).send('Successfully Logged In !');
            } else {
                res.status(401).send('Invalid password...');
            }
        }
    } catch(err) {
        next(err);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('user_token');
        res.status(200).send('Successfully Logged Out !');
    } catch(err) {
        next(err);
    };
}

export default { login, logout };