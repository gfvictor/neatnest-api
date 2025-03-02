import { User } from '@prisma/client';

export interface RoomRequest extends Request {
  user: User;
}