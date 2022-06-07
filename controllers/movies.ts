import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi from 'joi';
import * as Movie from '../models/movie';
import * as User from '../models/user';
import IMovie from '../interfaces/IMovie';
import { ErrorHandler } from '../helpers/errors';

interface ICookie {
    user_token: string;
  };

//Middleware de vérification des inputs
const validateMovie = (req: Request, res: Response, next: NextFunction) => {
    let required : Joi.PresenceMode = 'optional';
    if (req.method === 'POST') {
        required = 'required';
    }
    const errors = Joi.object({
        title: Joi.string().max(255).presence(required),
        director: Joi.string().max(255).presence(required),
        year: Joi.string().max(255).presence(required),
        color: Joi.number().min(0).max(1).presence(required),
        duration: Joi.number().min(0).presence(required),
    }).validate(req.body, { abortEarly: false }).error;
    if (errors) {
        next(new ErrorHandler(422, errors.message));
    } else {
        next();
    }
};

//Middleware de vérification que le film existe bien
const movieExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idMovie } = req.params;
        const movieExists = await Movie.getMovieById(Number(idMovie));
        if (!movieExists) {
            next(new ErrorHandler(404, 'This movie does not exist'));
        } else {
            // req.record = movieExists;
            next();
        }
    } catch(err) {
        next(err);
    }
};

const getAllMovies = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, director } = req.query as IMovie;
        const { user_token } = req.cookies as ICookie;
        const user = await User.getUserByToken(user_token);
        const idUser = user ? user.id : 0;
        const movies = await Movie.getAllMovies(title, director, idUser);
        // res.setHeader(
        //     'Content-Range',
        //     `users : 0-${users.length}/${users.length + 1}`  -> Fonction à mettre pour utiliser React Admin
        //   );
        return res.status(200).json(movies);
    } catch(err) {
        next(err);
    }
}) as RequestHandler;

const getOneMovie = (async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idMovie } = req.params;
        const movie = await Movie.getMovieById(Number(idMovie));
        movie ? res.status(200).json(movie) : res.sendStatus(404);
    } catch(err) {
        next(err);
    }
}) as RequestHandler;

const addMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_token } = req.cookies as ICookie;
        const user = await User.getUserByToken(user_token);
        if (user) {
            const movie = {...req.body, idUser: user.id} as IMovie;
            movie.id = await Movie.addMovie(movie);
            res.status(201).json(movie);
        } else {
            res.sendStatus(401);
        }
    } catch(err) {
        next(err);
    }
};

const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idMovie } = req.params;
        const movieUpdated = await Movie.updateMovie(Number(idMovie), req.body as IMovie); //movieUpdated est un booléen qui indique si la MAJ a bien été faite ou non
        if (movieUpdated) {
            const movie = await Movie.getMovieById(Number(idMovie));
            res.status(200).send(movie); // react-admin needs this response
        } else {
            throw new ErrorHandler(500, 'Movie cannot be updated');
        }
    } catch(err) {
        next(err);
    }
};

const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idMovie } = req.params;
        const movie = await Movie.getMovieById(Number(idMovie));
        const movieDeleted = await Movie.deleteMovie(Number(idMovie));
        if (movieDeleted) {
            res.status(200).send(movie); // react-admin needs this response
        } else {
            throw new ErrorHandler(500, 'Movie cannot be deleted');
        }
    } catch(err) {
        next(err);
    }
};

export default { validateMovie, movieExists, getAllMovies, getOneMovie, addMovie, updateMovie, deleteMovie };