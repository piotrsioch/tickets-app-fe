import { BaseModel } from '../../../../shared/models';

export interface User extends BaseModel {
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  refreshToken: string;
}
