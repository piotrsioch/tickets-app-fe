export interface DecodedToken {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  sessionId: string;
  type: 'AccessTokens' | 'RefreshTokens';
  iat: number;
  exp: number;
}
