import connection from '../db-config';
import IStudent from '../interfaces/IStudent';

const getAllStudents = async (filter = ''): Promise<IStudent[]> => {
  let sql = `SELECT id, firstname FROM students`;
  if (filter) {
    sql += ' WHERE firstname LIKE ?';
  }
  const results = await connection
    .promise()
    .query<IStudent[]>(sql, [`%${filter}%`]);
  return results[0];
};

const getStudentById = async (idStudent: number): Promise<IStudent> => {
  const [results] = await connection
    .promise()
    .query<IStudent[]>('SELECT id, firstname FROM students WHERE id = ?', [
      idStudent,
    ]);
  return results[0];
};

export { getAllStudents, getStudentById };
