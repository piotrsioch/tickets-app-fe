import { BaseModel } from '../../../../shared/models';

export interface UserWithToken extends BaseModel {
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  refreshToken: string;
}
