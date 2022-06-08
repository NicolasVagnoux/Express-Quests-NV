import studentsController from './controllers/students';
import usersController from './controllers/users'; //on importe l'ensemble du controlleur 'users' en lui donnant le nom usersController.
import moviesController from './controllers/movies'; //on importe l'ensemble du controlleur 'movies' en lui donnant le nom moviesController.
import authController from './controllers/auth';
import { Express } from 'express';

const setupRoutes = (server: Express) => {
  // STUDENTS
  // get students
  server.get('/api/students', studentsController.getAllStudents);
  // get students by id
  server.get('/api/students/:idStudent', studentsController.getOneStudent);

  //USERS
  //GET users
  server.get('/api/users', usersController.getAllUsers);
  //GET user by id
  server.get('/api/users/:idUser',
  usersController.userExists,
  usersController.getOneUser);
  // POST user
  server.post('/api/users', 
    usersController.validateUser,
    usersController.emailIsFree,
    usersController.addUser);
  //PUT user
  server.put('/api/users/:idUser',
    usersController.validateUser,
    usersController.userExists,
    usersController.updateUser);
  //DELETE user
  server.delete('/api/users/:idUser',
    usersController.userExists,
    usersController.deleteUser);

  //AUTHENTICATION
  //Login
  server.post('/api/login', authController.login);
  //Logout
  server.post('/api/logout', authController.logout);

  //MOVIES
  //GET movies
  server.get('/api/movies', moviesController.getAllMovies);
  //GET movies by id
  server.get('/api/movies/:idMovie', moviesController.getOneMovie);
  //POST movie
  server.post('/api/movies',
    moviesController.validateMovie, 
    moviesController.addMovie);
  //PUT movie
  server.put('/api/movies/:idMovie',
    moviesController.validateMovie,
    moviesController.movieExists,
    moviesController.updateMovie);
  //DELETE movie
  server.delete('/api/movies/:idMovie',
  moviesController.movieExists,
  moviesController.deleteMovie);
};

export default setupRoutes;
