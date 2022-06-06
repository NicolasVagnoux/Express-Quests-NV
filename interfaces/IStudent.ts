import { RowDataPacket } from 'mysql2';

export default interface IStudent extends RowDataPacket {
  id: number;
  firstname: string;
}
