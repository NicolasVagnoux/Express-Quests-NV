import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as User from '../models/user';
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
            passwordIsCorrect ? res.status(200).send('Mot de passe OK') : res.status(401).send('Mot de passe pas OK');
        }
    } catch(err) {
        next(err);
    }
};

export default { checkCredentials };