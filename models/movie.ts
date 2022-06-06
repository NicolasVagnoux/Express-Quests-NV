import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
import IMovie from '../interfaces/IMovie';

const getAllMovies = async (title : string = '', director : string = '') : Promise<IMovie[]> => {
    let sql  = 'SELECT * FROM movies';
    const sqlValues : string[] = [];
    if(title) {
        sql += ' WHERE title LIKE ?';
        sqlValues.push(`%${title}%`);
    }
    if(director) {
        if(title) {
            sql += ' AND director LIKE ?';
        } else {
            sql += ' WHERE director LIKE ?';
        }
        sqlValues.push(`%${director}%`);
    }
    const results = await connection
    .promise()
    .query<IMovie[]>(sql, sqlValues);
    return results[0];
};

const getMovieById = async (idMovie : number) : Promise<IMovie> => {
    const [results] = await connection
    .promise()
    .query<IMovie[]>('SELECT * FROM movies WHERE id = ?', [idMovie]);
    return results[0];
};

const addMovie = async (movie : IMovie) : Promise<number> => {
    const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)',
    [movie.title, movie.director, movie.year, movie.color, movie.duration]);
    return results[0].insertId;
}

const updateMovie = async (idMovie : number, movie: IMovie) : Promise<boolean> => {
    let sql = 'UPDATE movies SET ';
    const sqlValues : Array<string | number | boolean> = [];
    let oneValue : boolean = false;
    if (movie.title) {
        sql += 'title = ?';
        sqlValues.push(movie.title);
        oneValue = true;
    }
    if (movie.director) {
        sql += oneValue ? ' , director = ? ' : ' director = ? ';
        sqlValues.push(movie.director);
        oneValue = true;
    }
    if (movie.year) {
        sql += oneValue ? ' , year = ? ' : ' year = ? ';
        sqlValues.push(movie.year);
        oneValue = true;
    }
    if (movie.color) {
        sql += oneValue ? ' , color = ? ' : ' color = ? ';
        sqlValues.push(movie.color);
        oneValue = true;
    }
    if (movie.duration) {
        sql += oneValue ? ' , duration = ? ' : ' duration = ? ';
        sqlValues.push(movie.duration);
        oneValue = true;
    }
    sql += ' WHERE id = ?';
    sqlValues.push(idMovie);

    const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
    return results[0].affectedRows === 1;
};

const deleteMovie = async (idMovie : number) : Promise<boolean> => {
    const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM movies WHERE id = ?', [idMovie]);
    return results[0]. affectedRows === 1;
}

export { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie };