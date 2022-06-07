import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';
import { calculateToken } from '../helpers/usersHelper';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';

const checkCredentials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as IUser;
        const user = await User.getUserByEmail(email);
        if (!user) {
            throw new ErrorHandler(401, 'This user does not exist');
        } else {
            const passwordIsCorrect : boolean = await User.verifyPassword(password, user.password);
            if (passwordIsCorrect) {
                const token = calculateToken(email);
                // User.updateUser(user.id, {token : token} as IUser);
                res.cookie('user_token', token);
                res.status(200).json({email: user.email, token: user.token});
            } else {
                res.status(401).send('Invalid password...');
            }
        }
    } catch(err) {
        next(err);
    }
};

export default { checkCredentials };