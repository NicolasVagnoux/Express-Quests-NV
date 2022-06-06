import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';

// Middleware de vérification des inputs
const validateUser = (req: Request, res: Response, next: NextFunction) => {
    let required : Joi.PresenceMode = 'optional'; // On créé une variable required qui définit si les données sont requises ou non. Si la méthode est POST, le required devient obligatoire (mais pas si la méthode est PUT).
    if (req.method === 'POST') {
        required = 'required';
    }
    const errors = Joi.object({
        firstname: Joi.string().max(255).presence(required),
        lastname: Joi.string().max(255).presence(required),
        email: Joi.string().email().max(255).presence(required),
        city: Joi.string().max(255).optional(),
        language: Joi.string().max(255).optional(),
        password: Joi.string().min(8).max(255).presence(required),
    }).validate(req.body, { abortEarly: false }).error;
    if (errors) {
        next(new ErrorHandler(422, errors.message));
    } else {
        next();
    }
};

//Middleware de vérification que l'email est libre
const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as IUser;
        const userExists = await User.getUserByEmail(email);
        if (userExists) {
            next(new ErrorHandler(400, 'This user already exists'));
        } else {
            next();
        }
    } catch(err) {
        next(err);
    }
};

//Middleware de vérification que l'utilisateur existe bien
const userExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idUser } = req.params;
        const userExists = await User.getUserById(Number(idUser));
        if (!userExists) {
            next(new ErrorHandler(404, 'This user does not exist'));
        } else {
            // req.record = userExists;
            next();
        }
    } catch(err) {
        next(err);
    }
};

const getAllUsers = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const firstname : string = req.query.firstname as string;
        // const lastname : string = req.query.lastname as string;
        const { firstname, lastname }  = req.query as IUser; // -> Destructuration en disant que req.query est un IUser
        const users = await User.getAllUsers(firstname, lastname);
        // res.setHeader(
        //     'Content-Range',
        //     `users : 0-${users.length}/${users.length + 1}`  -> Fonction à mettre pour utiliser React Admin
        //   );
        return res.status(200).json(users);
    } catch(err) {
        next(err);
    }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

const getOneUser = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idUser } = req.params;
        const user = await User.getUserById(Number(idUser));
        user ? res.status(200).json(user) : res.sendStatus(404);
    } catch(err) {
        next(err);
    }
}) as RequestHandler;

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body as IUser; // On prend le body qu'on met dans une constante user.
        user.id = await User.addUser(user); // Puis on rajoute à cette constante l'id qui vient de l'insertId de la requête.
        res.status(201).json(user);
    } catch(err) {
        next(err);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idUser } = req.params;
        const userUpdated = await User.updateUser(Number(idUser), req.body as IUser); //userUpdated est un booléen (retourné par le modèle)
        if (userUpdated) {
            const user = await User.getUserById(Number(idUser));
            res.status(200).send(user); // react-admin needs this response
        } else {
            throw new ErrorHandler(500, 'User cannot be updated');
        }
    } catch(err) {
        next(err);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idUser } = req.params;
        const user = await User.getUserById(Number(idUser));
        const userDeleted = await User.deleteUser(Number(idUser)); //userDeleted est un booléen (retourné par le modèle)
        if (userDeleted) {
            res.status(200).send(user); // react-admin needs this response
        } else {
            throw new ErrorHandler(500, 'User cannot be deleted');
        }
    } catch(err) {
        next(err);
    }
};

export default { validateUser, emailIsFree, userExists, getAllUsers, getOneUser, addUser, updateUser, deleteUser };