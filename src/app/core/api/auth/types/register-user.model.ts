import { User } from './user.model';

export type RegisterUser = Omit<User, 'accessToken' | 'refreshToken'> & { password: string };
