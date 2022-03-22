import { Roles } from './roles';

export interface UserInterface {
  phoneNumber: string;
  telegramId: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: Roles;
}
