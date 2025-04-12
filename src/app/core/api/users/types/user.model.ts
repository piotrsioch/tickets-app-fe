import { UserRole } from './user-role.enum';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
}
