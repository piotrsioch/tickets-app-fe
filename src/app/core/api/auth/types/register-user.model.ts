import { UserWithToken } from './user.model';

export type RegisterUser = Omit<
  UserWithToken,
  'accessToken' | 'refreshToken' | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & { password: string };
