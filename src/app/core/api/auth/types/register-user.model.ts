import { User } from './user.model';

export type RegisterUser = Omit<
  User,
  'accessToken' | 'refreshToken' | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & { password: string };
