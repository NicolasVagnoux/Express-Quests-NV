import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
import { calculateToken } from '../helpers/usersHelper';
import IUser from '../interfaces/IUser';
const argon2 = require('argon2');

//Gestion des hash de mots de passe avec argon2
const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1
};
const hashPassword = (plainPassword : string) : Promise<string> => {
    return argon2.hash(plainPassword, hashingOptions);
};
const verifyPassword = (plainPassword : string, hashedPassword : string) : Promise<boolean> => {
    return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};
// ---

const getAllUsers = async (firstname : string = '', lastname : string = '') : Promise<IUser[]> => {
    let sql : string = `SELECT * FROM users`;
    let sqlValues : string[] = [];
    if(firstname) {
        sql += ' WHERE firstname LIKE ?';
        sqlValues.push(`%${firstname}%`)
    }
    if(lastname) {
        if(firstname) {
            sql += ' AND lastname LIKE ?';
        } else {
            sql += ' WHERE lastname LIKE ?';
        }
        sqlValues.push(`%${lastname}%`)
    }
    const results = await connection
    .promise()
    .query<IUser[]>(sql, sqlValues);
    return results[0];
};

const getUserById = async (idUser : number) : Promise<IUser> => {
    const [results] = await connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE id = ?', [idUser]);
    return results[0];
};

const getUserByEmail = async (email : string) : Promise<IUser> => {
    const [results] = await connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE email = ?', [email]);
    return results[0];
};

const getUserByToken = async (token: string) : Promise<IUser> => {
    const [results] = await connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE token = ?', [token]);
    return results[0];
};

const addUser = async (user : IUser) : Promise<number> => {
    const hashedPassword = await hashPassword(user.password);
    const token = await calculateToken(user.email);
    const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO users (firstname, lastname, email, city, language, password, token) VALUES (?,?,?,?,?,?,?)', 
    [user.firstname, user.lastname, user.email, user.city, user.language, hashedPassword, token]);
    return results[0].insertId;
};

const updateUser = async (idUser : number, user: IUser) : Promise<boolean> => {
    let sql = 'UPDATE users SET ';
    const sqlValues : Array<string | number> = [];
    let oneValue : boolean = false;
    if (user.firstname) {
        sql += 'firstname = ?';
        sqlValues.push(user.firstname);
        oneValue = true;
    }
    if (user.lastname) {
        sql += oneValue ? ' , lastname = ? ' : ' lastname = ? ';
        sqlValues.push(user.lastname);
        oneValue = true;
    }
    if (user.email) {
        sql += oneValue ? ' , email = ? ' : ' email = ? ';
        sqlValues.push(user.email);
        oneValue = true;
    }
    if (user.city) {
        sql += oneValue ? ' , city = ? ' : ' city = ? ';
        sqlValues.push(user.city);
        oneValue = true;
    }
    if (user.language) {
        sql += oneValue ? ' , language = ? ' : ' language = ? ';
        sqlValues.push(user.language);
        oneValue = true;
    }
    if (user.password) {
        sql += oneValue ? ', password = ? ' : ' password = ? ';
        const hashedPassword : string = await hashPassword(user.password);
        sqlValues.push(hashedPassword);
        oneValue = true;
    }
    if (user.email || user.token) {
        sql += oneValue ? ' , token = ? ' : ' token = ? ';
        const token = calculateToken(user.email);
        sqlValues.push(token);
        oneValue = true;
    }
    sql += ' WHERE id = ?';
    sqlValues.push(idUser);

    const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
    return results[0].affectedRows === 1;
};

const deleteUser = async (idUser: number) : Promise<boolean> => {
    const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [idUser]);
    return results[0].affectedRows === 1;
}

export { getAllUsers, getUserById, getUserByEmail, getUserByToken, addUser, updateUser, deleteUser, hashPassword, verifyPassword };