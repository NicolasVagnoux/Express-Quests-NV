import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Student from '../models/student';

// get all students
const getAllStudents = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: string = req.query.filter as string;
    const students = await Student.getAllStudents(filter);

    res.setHeader(
      'Content-Range',
      `students : 0-${students.length}/${students.length + 1}`
    );
    return res.status(200).json(students);
  } catch (err) {
    next(err);
  }
}) as RequestHandler; // Used to avoid eslint error : Promise returned in function argument where a void return was expected

// get one student
const getOneStudent = (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idStudent } = req.params;
    const student = await Student.getStudentById(Number(idStudent));
    student ? res.status(200).json(student) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}) as RequestHandler;

export default {
  getAllStudents,
  getOneStudent,
};
