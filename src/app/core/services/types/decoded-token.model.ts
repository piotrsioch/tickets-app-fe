import { UserRole } from '../../api/users/types';

export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  type: 'AccessTokens' | 'RefreshTokens';
  iat: number;
  exp: number;
}
